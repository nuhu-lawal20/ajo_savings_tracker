import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  reference: z.string().min(5),
  reason: z.string().optional(),
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

    const { reference, reason } = parsed.data;
    const adminDb = createAdminClient();

    // 1. Fetch pending wallet_ledger entry
    const { data: entry } = await adminDb
      .from("wallet_ledger")
      .select("id, status")
      .eq("reference", reference)
      .eq("user_id", user.id)
      .single();

    if (!entry) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Only update if still pending
    if (entry.status === "pending") {
      await adminDb
        .from("wallet_ledger")
        .update({
          status: "failed",
          description: reason ? `Wallet top-up — ${reason}` : "Wallet top-up cancelled / declined",
        })
        .eq("id", entry.id);
    }

    return NextResponse.json({ success: true, message: "Transaction marked as declined / failed" });
  } catch (err: any) {
    console.error("[wallet/cancel]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
