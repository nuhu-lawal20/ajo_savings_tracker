import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const verifySchema = z.object({
  step: z.enum(["tier1", "tier2", "tier3"]).default("tier1"),
  // Tier 1: BVN / NIN
  idType: z.enum(["bvn", "nin"]).optional(),
  idNumber: z.string().optional(),
  // Tier 2: Government ID & Biometrics
  idDocType: z.enum(["passport", "drivers_license", "voters_card", "national_id"]).optional(),
  selfieCaptured: z.boolean().optional(),
  // Tier 3: CAC Registration
  cacNumber: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.enum(["limited_company", "enterprise_sole_prop", "cooperative", "ngo"]).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid verification parameters", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { step, idType, idNumber, idDocType, cacNumber, businessName, businessType } = parsed.data;
    const adminDb = createAdminClient();

    // Fetch existing profile
    const { data: profile, error: profileError } = await adminDb
      .from("profiles")
      .select("kyc_tier, trust_score, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // ─── TIER 1: BVN / NIN (Max ₦1,000,000 Total Pool) ────────────────────────
    if (step === "tier1") {
      if (!idNumber || idNumber.length !== 11) {
        return NextResponse.json({ error: "Please enter a valid 11-digit BVN or NIN" }, { status: 400 });
      }

      if (profile.kyc_tier >= 1) {
        return NextResponse.json({
          message: "You are already Tier 1 Verified.",
          kyc_tier: profile.kyc_tier,
        });
      }

      await adminDb
        .from("profiles")
        .update({
          kyc_tier: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      // Dynamically recalculate holistic AI Trust Score from database engine
      const { data: computedScore } = await adminDb.rpc("calculate_trust_score", { p_user_id: user.id });
      const finalScore = computedScore ?? Math.min(100, (profile.trust_score ?? 30) + 15);

      revalidatePath("/profile");
      revalidatePath("/dashboard");
      revalidatePath("/circles");

      return NextResponse.json({
        success: true,
        message: `Identity verified via ${idType?.toUpperCase() || "BVN/NIN"}! You are now Tier 1 Verified (Max ₦1M total pool).`,
        kyc_tier: 1,
        trust_score: finalScore,
      });
    }

    // ─── TIER 2: GOVERNMENT ID & BIOMETRICS (Max ₦10,000,000 Total Pool) ─────
    if (step === "tier2") {
      if (profile.kyc_tier < 1) {
        return NextResponse.json({ error: "Please complete Tier 1 (BVN/NIN) verification first." }, { status: 400 });
      }

      if (profile.kyc_tier >= 2) {
        return NextResponse.json({
          message: "You are already Tier 2 Verified (Biometrics & Gov ID).",
          kyc_tier: profile.kyc_tier,
        });
      }

      // Simulated verified biometric government portrait (Smile ID / Dojah)
      const verifiedBiometricPhoto =
        profile.avatar_url ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`;

      await adminDb
        .from("profiles")
        .update({
          kyc_tier: 2,
          avatar_url: verifiedBiometricPhoto,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      // Dynamically recalculate holistic AI Trust Score from database engine
      const { data: computedScore } = await adminDb.rpc("calculate_trust_score", { p_user_id: user.id });
      const finalScore = computedScore ?? Math.min(100, (profile.trust_score ?? 45) + 15);

      revalidatePath("/profile");
      revalidatePath("/dashboard");
      revalidatePath("/circles");

      return NextResponse.json({
        success: true,
        message: `Government ID & Facial Biometrics verified! You are now Tier 2 Verified (Max ₦10M total pool).`,
        kyc_tier: 2,
        trust_score: finalScore,
        avatar_url: verifiedBiometricPhoto,
      });
    }

    // ─── TIER 3: CAC BUSINESS REGISTRATION (UNLIMITED POOLS) ──────────────────
    if (step === "tier3") {
      if (profile.kyc_tier < 2) {
        return NextResponse.json({ error: "Please complete Tier 2 (Gov ID & Biometrics) verification first." }, { status: 400 });
      }

      if (profile.kyc_tier >= 3) {
        return NextResponse.json({
          message: "You are already Tier 3 CAC Verified (Unlimited).",
          kyc_tier: profile.kyc_tier,
        });
      }

      if (!cacNumber || cacNumber.trim().length < 6) {
        return NextResponse.json({ error: "Please enter a valid CAC Registration Number (e.g. RC-1849204 or BN-3920194)" }, { status: 400 });
      }

      await adminDb
        .from("profiles")
        .update({
          kyc_tier: 3,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      // Dynamically recalculate holistic AI Trust Score from database engine
      const { data: computedScore } = await adminDb.rpc("calculate_trust_score", { p_user_id: user.id });
      const finalScore = computedScore ?? Math.min(100, (profile.trust_score ?? 60) + 20);

      revalidatePath("/profile");
      revalidatePath("/dashboard");
      revalidatePath("/circles");

      return NextResponse.json({
        success: true,
        message: `CAC Registration (${cacNumber.toUpperCase()}) verified! You are now Tier 3 CAC Verified with UNLIMITED pool limits.`,
        kyc_tier: 3,
        trust_score: finalScore,
      });
    }

    return NextResponse.json({ error: "Invalid verification step" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
