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

    // Fetch circle and user's membership
    const { data: circle, error: circleError } = await supabase
      .from("circles")
      .select("*, memberships!inner(*)")
      .eq("id", circleId)
      .eq("memberships.user_id", user.id)
      .single();

    if (circleError || !circle) {
      return NextResponse.json({ error: "Circle or membership not found" }, { status: 404 });
    }

    if (circle.status !== "active") {
      return NextResponse.json({ error: "Contributions can only be made to active circles" }, { status: 400 });
    }

    const membership = circle.memberships[0];

    // Generate unique Paystack reference (e.g. ALAJO-TX-XXXXX)
    const refUnique = crypto.randomBytes(6).toString("hex").toUpperCase();
    const paystackReference = `ALAJO-TX-${circleId.slice(0, 4)}-${refUnique}`;

    // Create pending transaction record
    const { data: transaction, error: txError } = await supabase
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
