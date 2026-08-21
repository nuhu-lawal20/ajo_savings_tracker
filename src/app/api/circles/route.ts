import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CreateCircleSchema } from "@/lib/validations";
import crypto from "crypto";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch circles created by user or where user is a member
  const { data: circles, error } = await supabase
    .from("circles")
    .select(`
      *,
      creator:profiles!circles_creator_id_fkey(full_name, email, avatar_url, trust_score),
      memberships(id, user_id, payout_position, has_paid_current_round, payout_status)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ circles });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CreateCircleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, contributionAmount, frequency, maxMembers } = parsed.data;

    // Fetch Creator's KYC Tier, Trust Score & Admin Status
    const { data: creatorProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("kyc_tier, trust_score, is_admin")
      .eq("id", user.id)
      .single();

    const kycTier = creatorProfile?.kyc_tier ?? 1;
    const trustScore = creatorProfile?.trust_score ?? 50;
    const isAdmin = creatorProfile?.is_admin === true;

    // Segregation of Duties: Admins cannot create consumer savings circles
    if (isAdmin) {
      return NextResponse.json(
        {
          error:
            "Segregation of Duties Policy: Administrative accounts are strictly restricted to platform oversight and fraud moderation. To create a personal savings circle, please use a verified regular member profile.",
        },
        { status: 403 }
      );
    }

    // Enforce Risk Tier Limits (Total Pool = contributionAmount * maxMembers):
    // Unverified (kycTier < 1): View only. Must verify BVN/NIN (Tier 1)
    // Tier 1 (kycTier === 1): Max ₦1,000,000 total pool payout
    // Tier 2 (kycTier === 2): Max ₦10,000,000 total pool payout (Gov ID & Biometrics)
    // Tier 3 (kycTier >= 3): CAC Registration (Unlimited)
    const totalPoolAmount = contributionAmount * maxMembers;

    if (kycTier < 1) {
      return NextResponse.json(
        {
          error: "Identity verification is strictly required before creating a savings circle. Please verify your 11-digit BVN or NIN to unlock Tier 1 verified circle creation (Max ₦1,000,000 pool).",
          requiredTier: 1,
        },
        { status: 403 }
      );
    }
    if (kycTier === 1 && totalPoolAmount > 1000000) {
      return NextResponse.json(
        {
          error: `Tier 1 accounts are limited to ₦1,000,000 total pool payout (this circle totals ₦${totalPoolAmount.toLocaleString()}). Upgrade to Tier 2 (Government ID & Biometrics) for pools up to ₦10,000,000.`,
          requiredTier: 2,
        },
        { status: 403 }
      );
    }
    if (kycTier === 2 && totalPoolAmount > 10000000) {
      return NextResponse.json(
        {
          error: `Tier 2 accounts are limited to ₦10,000,000 total pool payout (this circle totals ₦${totalPoolAmount.toLocaleString()}). Upgrade to Tier 3 (CAC Registration) for unlimited pool amounts.`,
          requiredTier: 3,
        },
        { status: 403 }
      );
    }



    // Generate unique 8-character invite code (e.g. KADASHE-9X2P)
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const inviteCode = `KADASHE-${randomHex}`;

    const adminDb = (await import("@/lib/supabase/admin")).createAdminClient();

    // Insert Circle
    const { data: circle, error: circleError } = await adminDb
      .from("circles")
      .insert({
        creator_id: user.id,
        name,
        description: description || null,
        contribution_amount: contributionAmount,
        frequency,
        max_members: maxMembers,
        invite_code: inviteCode,
        status: "pending",
        current_round: 1,
      })
      .select()
      .single();

    if (circleError) {
      return NextResponse.json({ error: circleError.message }, { status: 500 });
    }

    // Anti-Organizer Favoritism Law:
    // Organizer can NEVER take Position #1. Temporary slot is set to last position until pool is filled and algorithm finalizes all positions.
    const creatorPosition = maxMembers;

    // Auto-assign Creator
    const { error: memberError } = await adminDb.from("memberships").insert({
      circle_id: circle.id,
      user_id: user.id,
      payout_position: creatorPosition,
      has_paid_current_round: false,
      payout_status: "pending",
    });

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ circle, success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
