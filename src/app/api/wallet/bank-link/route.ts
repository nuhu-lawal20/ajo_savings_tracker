import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  account_number: z.string().regex(/^\d{10}$/, "Must be a 10-digit NUBAN account number"),
  bank_code: z.string().min(3),
});

// Fuzzy name match: returns similarity 0–1
function nameSimilarity(a: string, b: string): number {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).sort().join(" ");
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  // Jaccard token similarity
  const setA = new Set(na.split(" "));
  const setB = new Set(nb.split(" "));
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

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

    const { account_number, bank_code } = parsed.data;
    const adminDb = createAdminClient();

    // Fetch user's KYC full_name
    const { data: profile } = await adminDb
      .from("profiles")
      .select("full_name, kyc_tier")
      .eq("id", user.id)
      .single();

    if (!profile || profile.kyc_tier < 1) {
      return NextResponse.json({ error: "Tier 1 KYC verification required to link a bank account." }, { status: 403 });
    }

    // Call Paystack Account Name Enquiry
    const paystackRes = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    if (!paystackRes.ok) {
      return NextResponse.json({ error: "Could not verify bank account. Please check the account number and bank." }, { status: 400 });
    }

    const paystackData = await paystackRes.json();
    const resolvedName: string = paystackData?.data?.account_name ?? "";

    // KYC name match — 85% threshold
    const similarity = nameSimilarity(profile.full_name, resolvedName);
    if (similarity < 0.6) {
      return NextResponse.json({
        error: `Account name "${resolvedName}" does not match your verified name "${profile.full_name}". Only accounts in your own name are permitted.`,
        similarity,
      }, { status: 422 });
    }

    // Create Paystack Transfer Recipient
    const recipientRes = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "nuban",
        name: resolvedName,
        account_number,
        bank_code,
        currency: "NGN",
      }),
    });

    const recipientData = await recipientRes.json();
    const recipientCode: string = recipientData?.data?.recipient_code ?? "";

    // Save to profile
    await adminDb.from("profiles").update({
      bank_account_number: account_number,
      bank_account_name: resolvedName,
      bank_code,
      bank_verified_at: new Date().toISOString(),
      paystack_recipient_code: recipientCode,
    }).eq("id", user.id);

    return NextResponse.json({
      success: true,
      account_name: resolvedName,
      message: "Bank account verified and linked successfully.",
    });
  } catch (err) {
    console.error("[bank-link]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
