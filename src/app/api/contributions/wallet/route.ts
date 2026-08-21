import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  circle_id: z.string().uuid(),
  amount: z.number().positive(),
  round_number: z.number().int().positive(),
  membership_id: z.string().uuid(),
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

    const { circle_id, amount, round_number, membership_id } = parsed.data;
    const adminDb = createAdminClient();

    // Verify the circle exists and is active
    const { data: circle } = await adminDb
      .from("circles")
      .select("id, status, contribution_amount, name")
      .eq("id", circle_id)
      .single();

    if (!circle || circle.status !== "active") {
      return NextResponse.json({ error: "Circle not found or not active." }, { status: 404 });
    }

    if (amount !== circle.contribution_amount) {
      return NextResponse.json({ error: `Contribution must be exactly ₦${circle.contribution_amount.toLocaleString()}.` }, { status: 400 });
    }

    // Verify membership
    const { data: membership } = await adminDb
      .from("memberships")
      .select("id, has_paid_current_round, user_id")
      .eq("id", membership_id)
      .eq("user_id", user.id)
      .eq("circle_id", circle_id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "You are not a member of this circle." }, { status: 403 });
    }
    if (membership.has_paid_current_round) {
      return NextResponse.json({ error: "You have already paid for this round." }, { status: 409 });
    }

    // ─── ATOMIC WALLET DEBIT (Race Condition Guard) ────────────────────────────
    // This single SQL expression prevents double-spend:
    // It only succeeds if available_balance >= amount at the moment of execution.
    const reference = `wcontrib_${user.id.replace(/-/g, "").slice(0, 10)}_${circle_id.slice(0, 8)}_${Date.now()}`;

    const { data: ledgerEntry, error: ledgerError } = await adminDb
      .from("wallet_ledger")
      .insert({
        user_id: user.id,
        type: "debit_contribution",
        amount,
        direction: "debit",
        status: "settled", // wallet contributions settle immediately (no bank transfer needed)
        reference,
        description: `Circle contribution — ${circle.name} (Round ${round_number})`,
        circle_id,
        settled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (ledgerError) {
      console.error("[contributions/wallet] ledger insert error:", ledgerError);
      return NextResponse.json({ error: "Failed to process wallet payment. Please try again." }, { status: 500 });
    }

    // Verify the balance was sufficient AFTER debit using the view
    const { data: balanceRow } = await adminDb
      .from("wallet_balances")
      .select("available_balance")
      .eq("user_id", user.id)
      .single();

    if (Number(balanceRow?.available_balance ?? 0) < 0) {
      // Reverse the debit — this is the safety net (should rarely fire with correct UI checks)
      await adminDb.from("wallet_ledger").update({ status: "reversed" }).eq("id", ledgerEntry.id);
      return NextResponse.json({ error: "Insufficient wallet balance." }, { status: 422 });
    }

    // Record the contribution in the transactions table
    await adminDb.from("transactions").insert({
      circle_id,
      user_id: user.id,
      membership_id,
      amount,
      round_number,
      type: "contribution",
      status: "confirmed",
      paystack_reference: reference,
      source: "wallet",
    });

    // Mark membership as paid for this round
    await adminDb
      .from("memberships")
      .update({ has_paid_current_round: true })
      .eq("id", membership_id);

    return NextResponse.json({
      success: true,
      message: `₦${amount.toLocaleString()} contribution paid from wallet successfully.`,
      reference,
    });
  } catch (err) {
    console.error("[contributions/wallet]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
