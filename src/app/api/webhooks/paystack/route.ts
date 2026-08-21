import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 401 });
    }

    // Verify HMAC-SHA512 Signature (Security Layer L6)
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const supabase = createAdminClient();

    // ─── EVENT: charge.success ────────────────────────────────────────────────
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const amountPaid = data.amount / 100; // kobo → naira
      const metadata = data.metadata ?? {};

      // ── BRANCH A: Wallet Top-Up (reference starts with wfund_) ──
      if (metadata.type === "wallet_fund" && reference?.startsWith("wfund_")) {
        const { data: existingEntry } = await supabase
          .from("wallet_ledger")
          .select("id, status")
          .eq("reference", reference)
          .single();

        if (existingEntry?.status === "settled") {
          return NextResponse.json({ received: true, note: "Already settled" }, { status: 200 });
        }

        await supabase
          .from("wallet_ledger")
          .update({ status: "settled", settled_at: new Date().toISOString() })
          .eq("reference", reference);

        console.log(`[webhook] Wallet funded: ${reference} — ₦${amountPaid} for user ${metadata.user_id}`);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // ── BRANCH B: Standard Circle Contribution ──
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("paystack_reference", reference)
        .single();

      if (txError || !transaction) {
        console.error("Webhook transaction not found for reference:", reference);
        return NextResponse.json({ received: true, note: "Transaction not found" }, { status: 200 });
      }

      // Idempotency guard
      if (transaction.status === "confirmed") {
        return NextResponse.json({ received: true, note: "Already processed" }, { status: 200 });
      }

      // Mark contribution confirmed
      await supabase.from("transactions").update({ status: "confirmed" }).eq("id", transaction.id);

      // Mark membership paid
      await supabase
        .from("memberships")
        .update({ has_paid_current_round: true })
        .eq("id", transaction.membership_id);

      // Trigger Trust Score recalculation
      await supabase.rpc("calculate_trust_score", { p_user_id: transaction.user_id });

      // Check if all members have paid this round
      const { data: allMembers } = await supabase
        .from("memberships")
        .select("has_paid_current_round, payout_position, user_id")
        .eq("circle_id", transaction.circle_id);

      const allPaid = allMembers?.every((m) => m.has_paid_current_round);

      if (allPaid && allMembers && allMembers.length > 0) {
        const { data: circle } = await supabase
          .from("circles")
          .select("current_round, max_members, contribution_amount, name")
          .eq("id", transaction.circle_id)
          .single();

        if (circle) {
          const recipientMember = allMembers.find((m) => m.payout_position === circle.current_round);

          if (recipientMember) {
            const totalPayout = Number(circle.contribution_amount) * circle.max_members;
            const payoutRef = `KADASHE-PAYOUT-${transaction.circle_id.slice(0, 4)}-R${circle.current_round}-${Date.now()}`;

            // Create payout transaction record
            await supabase.from("transactions").insert({
              circle_id: transaction.circle_id,
              user_id: recipientMember.user_id,
              membership_id: transaction.membership_id,
              amount: totalPayout,
              round_number: circle.current_round,
              type: "payout",
              status: "confirmed",
              paystack_reference: payoutRef,
            });

            // ── AUTO-CREDIT PAYOUT TO MEMBER WALLET (Phase 11 — D028) ──────
            const walletRef = `${payoutRef}-wallet`;
            const { error: walletInsertErr } = await supabase.from("wallet_ledger").insert({
              user_id: recipientMember.user_id,
              type: "credit_payout",
              amount: totalPayout,
              direction: "credit",
              status: "settled",
              reference: walletRef,
              description: `Adashe payout — ${circle.name} (Round ${circle.current_round})`,
              circle_id: transaction.circle_id,
              settled_at: new Date().toISOString(),
            });

            if (walletInsertErr) {
              console.error("[webhook] Failed to credit wallet for payout:", walletInsertErr);
            } else {
              console.log(`[webhook] Payout credited to wallet: ₦${totalPayout} → user ${recipientMember.user_id}`);
            }
          }

          // Advance or complete the circle
          if (circle.current_round < circle.max_members) {
            await supabase
              .from("memberships")
              .update({ has_paid_current_round: false })
              .eq("circle_id", transaction.circle_id);

            await supabase
              .from("circles")
              .update({ current_round: circle.current_round + 1 })
              .eq("id", transaction.circle_id);
          } else {
            await supabase
              .from("circles")
              .update({ status: "completed" })
              .eq("id", transaction.circle_id);
          }
        }
      }
    }

    // ─── EVENT: transfer.success (Withdrawal confirmed by Paystack) ───────────
    if (event.event === "transfer.success") {
      const reference = event.data?.reference;
      if (reference?.startsWith("wdraw_")) {
        await supabase
          .from("wallet_ledger")
          .update({ status: "settled", settled_at: new Date().toISOString() })
          .eq("reference", reference);
        console.log(`[webhook] Withdrawal settled: ${reference}`);
      }
    }

    // ─── EVENT: transfer.failed / transfer.reversed (Reverse debit) ───────────
    if (event.event === "transfer.failed" || event.event === "transfer.reversed") {
      const reference = event.data?.reference;
      if (reference?.startsWith("wdraw_")) {
        await supabase
          .from("wallet_ledger")
          .update({ status: "reversed" })
          .eq("reference", reference);
        console.log(`[webhook] Withdrawal reversed: ${reference}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
