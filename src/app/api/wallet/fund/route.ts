import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number().min(500, "Minimum top-up is ₦500").max(500000, "Maximum top-up is ₦500,000"),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const adminDb = createAdminClient();
    const { data: profile } = await adminDb
      .from("profiles")
      .select("email, full_name, kyc_tier")
      .eq("id", user.id)
      .single();

    if (!profile || profile.kyc_tier < 1) {
      return NextResponse.json({ error: "Tier 1 KYC required to fund wallet." }, { status: 403 });
    }

    // Generate a unique idempotency reference
    const reference = `wfund_${user.id.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;

    // Create a pending wallet_ledger entry BEFORE redirecting to Paystack
    // This is the idempotency anchor — even if webhook fires twice, reference UNIQUE constraint blocks duplicate credits
    await adminDb.from("wallet_ledger").insert({
      user_id: user.id,
      type: "fund",
      amount: parsed.data.amount,
      direction: "credit",
      status: "pending",
      reference,
      description: `Wallet top-up via Paystack`,
    });

    // Return the Paystack inline payload for the frontend to initialise
    return NextResponse.json({
      success: true,
      reference,
      amount: parsed.data.amount * 100, // Paystack expects kobo
      email: profile.email,
      metadata: {
        user_id: user.id,
        type: "wallet_fund",
        full_name: profile.full_name,
      },
    });
  } catch (err) {
    console.error("[wallet/fund]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
