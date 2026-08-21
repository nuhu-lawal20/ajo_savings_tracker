import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  reference: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    }

    const { reference } = parsed.data;
    const adminDb = createAdminClient();

    // 1. Fetch pending wallet_ledger entry
    const { data: entry, error: entryErr } = await adminDb
      .from("wallet_ledger")
      .select("*")
      .eq("reference", reference)
      .eq("user_id", user.id)
      .single();

    if (entryErr || !entry) {
      return NextResponse.json({ error: "Ledger transaction not found" }, { status: 404 });
    }

    // If already settled, idempotent return
    if (entry.status === "settled") {
      return NextResponse.json({ success: true, message: "Already settled", settled: true });
    }

    // 2. Verify with Paystack API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (paystackRes.ok && paystackData?.data?.status === "success") {
      // Settle the ledger entry
      await adminDb
        .from("wallet_ledger")
        .update({
          status: "settled",
          settled_at: new Date().toISOString(),
          description: `Wallet top-up via Paystack (${paystackData.data.channel || "card"})`,
          metadata: {
            paystack_channel: paystackData.data.channel,
            gateway_response: paystackData.data.gateway_response,
            ip_address: paystackData.data.ip_address,
          },
        })
        .eq("id", entry.id);

      return NextResponse.json({
        success: true,
        message: `Wallet credited with ₦${Number(entry.amount).toLocaleString()}`,
        amount: entry.amount,
      });
    }

    // If Paystack returned failed or declined, mark ledger as failed immediately
    const gatewayStatus = paystackData?.data?.status;
    const gatewayResponse = paystackData?.data?.gateway_response || "Payment declined";

    if (gatewayStatus === "failed" || gatewayStatus === "abandoned" || !paystackRes.ok) {
      await adminDb
        .from("wallet_ledger")
        .update({
          status: "failed",
          description: `Wallet top-up — ${gatewayResponse}`,
          metadata: {
            gateway_response: gatewayResponse,
            status: gatewayStatus,
          },
        })
        .eq("id", entry.id);

      return NextResponse.json({
        error: gatewayResponse,
        status: "failed",
      }, { status: 400 });
    }

    return NextResponse.json({
      error: gatewayResponse || "Payment verification incomplete",
      status: gatewayStatus || "pending",
    }, { status: 400 });
  } catch (err: any) {
    console.error("[wallet/verify]", err);
    return NextResponse.json({ error: "Verification server error" }, { status: 500 });
  }
}
