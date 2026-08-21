import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MakeContributionSchema } from "@/lib/validations";
import crypto from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = MakeContributionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contribution parameters" }, { status: 400 });
    }

    const { circleId, amount } = parsed.data;

    const adminDb = (await import("@/lib/supabase/admin")).createAdminClient();

    // 1. Fetch circle
    const { data: circle, error: circleError } = await adminDb
      .from("circles")
      .select("*")
      .eq("id", circleId)
      .single();

    if (circleError || !circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    if (circle.status !== "active") {
      return NextResponse.json({ error: "Contributions can only be made to active circles" }, { status: 400 });
    }

    // 2. Fetch user membership
    const { data: membership, error: memError } = await adminDb
      .from("memberships")
      .select("*")
      .eq("circle_id", circleId)
      .eq("user_id", user.id)
      .single();

    if (memError || !membership) {
      return NextResponse.json({ error: "You are not a member of this circle" }, { status: 403 });
    }

    // Generate unique Paystack reference (e.g. KADASHE-TX-XXXXX)
    const refUnique = crypto.randomBytes(6).toString("hex").toUpperCase();
    const paystackReference = `KADASHE-TX-${circleId.slice(0, 4)}-${refUnique}`;

    // Create pending transaction record
    const { data: transaction, error: txError } = await adminDb
      .from("transactions")
      .insert({
        circle_id: circleId,
        user_id: user.id,
        membership_id: membership.id,
        amount,
        round_number: circle.current_round,
        type: "contribution",
        status: "pending",
        paystack_reference: paystackReference,
      })
      .select()
      .single();

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reference: paystackReference,
      amount: amount * 100, // In kobo for Paystack
      email: user.email,
      transactionId: transaction.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
