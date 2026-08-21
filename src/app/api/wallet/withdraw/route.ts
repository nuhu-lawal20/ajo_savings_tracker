import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number().min(500, "Minimum withdrawal is ₦500"),
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

    const { amount } = parsed.data;
    const adminDb = createAdminClient();

    // Fetch profile: bank link + KYC
    const { data: profile } = await adminDb
      .from("profiles")
      .select("full_name, kyc_tier, bank_account_number, bank_account_name, bank_code, paystack_recipient_code, bank_verified_at")
      .eq("id", user.id)
      .single();

    if (!profile?.bank_account_number || !profile?.paystack_recipient_code) {
      return NextResponse.json({ error: "No verified bank account linked. Please link your bank account first." }, { status: 400 });
    }
    if (!profile?.kyc_tier || profile.kyc_tier < 1) {
      return NextResponse.json({ error: "Tier 1 KYC required to withdraw." }, { status: 403 });
    }

    // Compute confirmed available balance from the ledger view (safe read)
    const { data: balanceRow } = await adminDb
      .from("wallet_balances")
      .select("available_balance")
      .eq("user_id", user.id)
      .single();

    const available = Number(balanceRow?.available_balance ?? 0);
    if (amount > available) {
      return NextResponse.json({
        error: `Insufficient wallet balance. Available: ₦${available.toLocaleString()}`,
        available,
      }, { status: 422 });
    }

    // Create a pending DEBIT entry (reserve the funds immediately)
    const reference = `wdraw_${user.id.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;
    const { data: ledgerRow } = await adminDb.from("wallet_ledger").insert({
      user_id: user.id,
      type: "withdraw",
      amount,
      direction: "debit",
      status: "pending",
      reference,
      description: `Withdrawal to ${profile.bank_account_name} (${profile.bank_account_number.slice(-4).padStart(10, "*")})`,
    }).select().single();

    if (!ledgerRow) {
      return NextResponse.json({ error: "Failed to reserve withdrawal. Please try again." }, { status: 500 });
    }

    // Initiate Paystack Transfer
    const transferRes = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount * 100, // kobo
        recipient: profile.paystack_recipient_code,
        reason: `Kadashe Wallet Withdrawal — ${profile.full_name}`,
        reference,
      }),
    });

    const transferData = await transferRes.json();

    if (!transferRes.ok || !transferData?.data?.transfer_code) {
      // Rollback: mark ledger entry as failed
      await adminDb.from("wallet_ledger").update({ status: "failed" }).eq("id", ledgerRow.id);
      return NextResponse.json({
        error: transferData?.message ?? "Paystack transfer failed. Please try again.",
      }, { status: 502 });
    }

    const transferCode = transferData.data.transfer_code;
    const transferStatus = transferData.data.status; // 'otp' | 'pending' | 'success'

    // Save transfer_code into metadata
    await adminDb.from("wallet_ledger").update({
      metadata: {
        transfer_code: transferCode,
        paystack_status: transferStatus,
      },
    }).eq("id", ledgerRow.id);

    // If Paystack reports instant success (OTP disabled on dashboard), settle immediately
    if (transferStatus === "success") {
      await adminDb.from("wallet_ledger").update({
        status: "settled",
        settled_at: new Date().toISOString(),
      }).eq("id", ledgerRow.id);

      return NextResponse.json({
        success: true,
        settled: true,
        message: `₦${amount.toLocaleString()} withdrawal successful and sent to your bank account!`,
        reference,
      });
    }

    // If Paystack requires OTP (sent SMS to user phone)
    const requiresOtp = transferStatus === "otp" || transferData?.message?.toLowerCase().includes("otp");

    return NextResponse.json({
      success: true,
      requires_otp: requiresOtp,
      transfer_code: transferCode,
      reference,
      message: requiresOtp
        ? "Paystack sent an authorization OTP code to your registered phone number. Enter it to finalize."
        : `₦${amount.toLocaleString()} withdrawal initiated. Processing with Paystack.`,
    });
  } catch (err) {
    console.error("[wallet/withdraw]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminDb = createAdminClient();
    const { data: balanceRow } = await adminDb
      .from("wallet_balances")
      .select("available_balance, total_credited, total_debited")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      available_balance: Number(balanceRow?.available_balance ?? 0),
      total_credited: Number(balanceRow?.total_credited ?? 0),
      total_debited: Number(balanceRow?.total_debited ?? 0),
    });
  } catch (err) {
    console.error("[wallet/balance]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
