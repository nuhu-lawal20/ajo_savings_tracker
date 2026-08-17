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

    // Verify HMAC-SHA512 Signature using PAYSTACK_SECRET_KEY
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Process charge.success event
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const amountPaid = data.amount / 100; // Paystack sends in kobo

      const supabase = createAdminClient();

      // 1. Fetch pending transaction by reference
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("paystack_reference", reference)
        .single();

      if (txError || !transaction) {
        console.error("Webhook transaction not found for reference:", reference);
        return NextResponse.json({ received: true, note: "Transaction not found" }, { status: 200 });
      }

      // If already confirmed, idempotent early return
      if (transaction.status === "confirmed") {
        return NextResponse.json({ received: true, note: "Already processed" }, { status: 200 });
      }

      // 2. Mark transaction confirmed
      await supabase
        .from("transactions")
        .update({ status: "confirmed" })
        .eq("id", transaction.id);

      // 3. Mark membership has_paid_current_round = true
      await supabase
        .from("memberships")
        .update({ has_paid_current_round: true })
        .eq("id", transaction.membership_id);

      // 4. Trigger Trust Score calculation
      await supabase.rpc("calculate_trust_score", {
        p_user_id: transaction.user_id,
      });

      // 5. Check if all members in the circle have paid this round
      const { data: allMembers } = await supabase
        .from("memberships")
        .select("has_paid_current_round, payout_position, user_id")
        .eq("circle_id", transaction.circle_id);

      const allPaid = allMembers?.every((m) => m.has_paid_current_round);

      if (allPaid && allMembers && allMembers.length > 0) {
        // Fetch circle
        const { data: circle } = await supabase
          .from("circles")
          .select("current_round, max_members, contribution_amount")
          .eq("id", transaction.circle_id)
          .single();

        if (circle) {
          const recipientMember = allMembers.find((m) => m.payout_position === circle.current_round);

          if (recipientMember) {
            // Create payout record
            const totalPayout = Number(circle.contribution_amount) * circle.max_members;
            const payoutRef = `ALAJO-PAYOUT-${transaction.circle_id.slice(0, 4)}-R${circle.current_round}-${Date.now()}`;

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
          }

          // Advance round or mark completed
          if (circle.current_round < circle.max_members) {
            // Reset has_paid_current_round for all members
            await supabase
              .from("memberships")
              .update({ has_paid_current_round: false })
              .eq("circle_id", transaction.circle_id);

            // Increment circle round
            await supabase
              .from("circles")
              .update({ current_round: circle.current_round + 1 })
              .eq("id", transaction.circle_id);
          } else {
            // Circle complete!
            await supabase
              .from("circles")
              .update({ status: "completed" })
              .eq("id", transaction.circle_id);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
