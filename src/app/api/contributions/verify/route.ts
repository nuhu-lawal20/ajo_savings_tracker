import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  reference: z.string().min(1, "Reference is required"),
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

    const { reference } = parsed.data;
    const adminDb = createAdminClient();

    // 1. Fetch transaction record
    const { data: transaction } = await adminDb
      .from("transactions")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Idempotency: already confirmed
    if (transaction.status === "confirmed") {
      return NextResponse.json({ success: true, status: "confirmed", already_confirmed: true });
    }

    // 2. Verify with Paystack API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();
    const isPaystackSuccess = paystackRes.ok && paystackData?.data?.status === "success";

    if (isPaystackSuccess) {
      // Mark transaction confirmed
      await adminDb.from("transactions").update({ status: "confirmed" }).eq("id", transaction.id);

      // Mark membership as paid
      if (transaction.membership_id) {
        await adminDb
          .from("memberships")
          .update({ has_paid_current_round: true })
          .eq("id", transaction.membership_id);
      }

      // Recalculate Trust Score
      try {
        await adminDb.rpc("calculate_trust_score", { p_user_id: transaction.user_id });
      } catch (rpcErr) {
        console.error("Trust score recalculation error:", rpcErr);
      }

      // Check if all members in circle paid this round
      const { data: allMembers } = await adminDb
        .from("memberships")
        .select("id, has_paid_current_round, payout_position, user_id")
        .eq("circle_id", transaction.circle_id);

      const allPaid = allMembers?.every((m) => m.has_paid_current_round);

      if (allPaid && allMembers && allMembers.length > 0) {
        const { data: circle } = await adminDb
          .from("circles")
          .select("current_round, max_members, contribution_amount, name")
          .eq("id", transaction.circle_id)
          .single();

        if (circle) {
          const recipientMember = allMembers.find((m) => m.payout_position === circle.current_round);
          if (recipientMember) {
            const totalPayout = Number(circle.contribution_amount) * circle.max_members;

            // Record payout transaction
            await adminDb.from("transactions").insert({
              circle_id: transaction.circle_id,
              user_id: recipientMember.user_id,
              membership_id: recipientMember.id,
              amount: totalPayout,
              round_number: circle.current_round,
              type: "payout",
              status: "confirmed",
              paystack_reference: `PAYOUT-R${circle.current_round}-${Date.now()}`,
            });

            // Credit the recipient member's wallet ledger
            await adminDb.from("wallet_ledger").insert({
              user_id: recipientMember.user_id,
              type: "credit_payout",
              amount: totalPayout,
              direction: "credit",
              status: "settled",
              settled_at: new Date().toISOString(),
              reference: `payout_w_${transaction.circle_id.slice(0, 8)}_r${circle.current_round}_${Date.now()}`,
              description: `Round #${circle.current_round} Rotational Payout — ${circle.name}`,
            });

            // Advance circle round
            if (circle.current_round < circle.max_members) {
              await adminDb
                .from("circles")
                .update({ current_round: circle.current_round + 1 })
                .eq("id", transaction.circle_id);

              await adminDb
                .from("memberships")
                .update({ has_paid_current_round: false })
                .eq("circle_id", transaction.circle_id);
            } else {
              await adminDb
                .from("circles")
                .update({ status: "completed" })
                .eq("id", transaction.circle_id);
            }
          }
        }
      }

      return NextResponse.json({ success: true, status: "confirmed" });
    }

    if (paystackData?.data?.status === "failed" || paystackData?.data?.status === "abandoned") {
      await adminDb.from("transactions").update({ status: "failed" }).eq("id", transaction.id);
      return NextResponse.json({ success: false, status: "failed" });
    }

    return NextResponse.json({ success: true, status: "pending" });
  } catch (err: any) {
    console.error("[api/contributions/verify]", err);
    return NextResponse.json({ error: err?.message || "Verification error" }, { status: 500 });
  }
}
