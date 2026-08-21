import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();
    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 });
    }

    const adminDb = createAdminClient();

    // Mark the pending contribution transaction as declined/abandoned
    await adminDb
      .from("transactions")
      .update({ status: "declined" })
      .eq("paystack_reference", reference)
      .eq("status", "pending");

    return NextResponse.json({ success: true, status: "declined" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Cancel failed" }, { status: 500 });
  }
}
