import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { JoinCircleSchema } from "@/lib/validations";
import { sortMembersForPayoutQueue } from "@/lib/payout-queue";


export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in to join a savings circle" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = JoinCircleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
    }

    const { inviteCode } = parsed.data;

    const adminDb = createAdminClient();

    // 1. Fetch circle by invite code with all memberships using adminDb to bypass RLS
    const { data: circle, error: circleError } = await adminDb
      .from("circles")
      .select("*, memberships(id, user_id, payout_position)")
      .eq("invite_code", inviteCode.trim().toUpperCase())
      .single();

    if (circleError || !circle) {
      return NextResponse.json({ error: "Circle not found with this invite code" }, { status: 404 });
    }

    // Check circle status
    if (circle.status !== "pending") {
      return NextResponse.json(
        { error: "This savings circle has already started or completed" },
        { status: 400 }
      );
    }

    const currentMembers = circle.memberships ?? [];

    // Check if user is already a member
    const alreadyMember = currentMembers.some((m: any) => m.user_id === user.id);
    if (alreadyMember) {
      return NextResponse.json({
        message: "You are already a member of this circle",
        circleId: circle.id,
        success: true,
      });
    }

    // Check capacity
    if (currentMembers.length >= circle.max_members) {
      return NextResponse.json({ error: "This circle is already at full capacity" }, { status: 400 });
    }

    // 2. Fetch User's Profile (KYC Tier, Trust Score, Admin, full_name, phone)
    const { data: profile } = await adminDb
      .from("profiles")
      .select("kyc_tier, trust_score, is_admin, full_name, phone")
      .eq("id", user.id)
      .single();

    const kycTier = profile?.kyc_tier ?? 1;
    const trustScore = profile?.trust_score ?? 50;
    const isAdmin = profile?.is_admin === true;

    // Check basic profile completeness (Tier 1 requirement)
    if (!profile?.full_name || profile.full_name.trim() === "") {
      return NextResponse.json(
        {
          error: "Please complete your full name and phone number on your profile before joining a savings circle.",
        },
        { status: 403 }
      );
    }

    // Segregation of Duties: Admins cannot participate in consumer savings circles
    if (isAdmin) {
      return NextResponse.json(
        {
          error:
            "Segregation of Duties Policy: Administrative accounts are strictly restricted to system oversight and fraud moderation. To join a communal savings pool, please use a standard member profile.",
        },
        { status: 403 }
      );
    }

    // Enforce Risk Tier Limits on Join (Total Pool = circle.contribution_amount * circle.max_members):
    const totalPoolAmount = Number(circle.contribution_amount) * (circle.max_members || 1);

    if (kycTier < 1) {
      return NextResponse.json(
        {
          error: "Identity verification (Tier 1 BVN / NIN) is strictly required before joining any savings circle. Please verify your identity to join this pool.",
          requiredTier: 1,
        },
        { status: 403 }
      );
    }
    if (totalPoolAmount > 1000000 && kycTier < 2) {
      return NextResponse.json(
        {
          error: `This circle totals ₦${totalPoolAmount.toLocaleString()} payout which requires Tier 2 (Government ID & Biometrics) verification.`,
          requiredTier: 2,
        },
        { status: 403 }
      );
    }
    if (totalPoolAmount > 10000000 && kycTier < 3) {
      return NextResponse.json(
        {
          error: `This circle totals ₦${totalPoolAmount.toLocaleString()} payout which requires Tier 3 (CAC Registration) verification.`,
          requiredTier: 3,
        },
        { status: 403 }
      );
    }

    // 3. Determine available payout positions (1 to max_members)
    const takenPositions = new Set(currentMembers.map((m: any) => Number(m.payout_position)));
    const allPositions = Array.from({ length: circle.max_members }, (_, i) => i + 1);
    const availablePositions = allPositions.filter((pos) => !takenPositions.has(pos));

    if (availablePositions.length === 0) {
      return NextResponse.json({ error: "No available payout positions remaining" }, { status: 400 });
    }

    let assignedPosition: number;

    // AI Reputation Algorithm for Payout Slots:
    if (trustScore < 40) {
      assignedPosition = availablePositions[availablePositions.length - 1];
    } else if (trustScore >= 70) {
      assignedPosition = availablePositions[0];
    } else {
      assignedPosition = availablePositions[0];
    }

    // 4. Insert Membership using adminDb to bypass RLS
    const { data: membership, error: joinError } = await adminDb
      .from("memberships")
      .insert({
        circle_id: circle.id,
        user_id: user.id,
        payout_position: assignedPosition,
        has_paid_current_round: false,
        payout_status: "pending",
      })
      .select()
      .single();

    if (joinError) {
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    // 5. Auto-Start Circle when all member slots are filled (Zero Administrative Bottleneck)
    const isNowFull = (currentMembers.length + 1) >= circle.max_members;
    if (isNowFull && circle.status === "pending") {
      const adminDb = createAdminClient();

      // Fetch all members with trust scores to assign earned payout positions
      const { data: fullMemberList } = await adminDb
        .from("memberships")
        .select("id, user_id, joined_at, profile:profiles!user_id(trust_score)")
        .eq("circle_id", circle.id);

      if (fullMemberList && fullMemberList.length > 0) {
        const sorted = sortMembersForPayoutQueue(fullMemberList as any, circle.creator_id);


        // High offset first to bypass unique constraint
        for (let i = 0; i < sorted.length; i++) {
          await adminDb
            .from("memberships")
            .update({ payout_position: 100 + i + 1 })
            .eq("id", sorted[i].id);
        }

        // Apply 1-based earned positions
        for (let i = 0; i < sorted.length; i++) {
          await adminDb
            .from("memberships")
            .update({ payout_position: i + 1 })
            .eq("id", sorted[i].id);
        }
      }

      await adminDb
        .from("circles")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", circle.id);
    }


    return NextResponse.json(
      {
        success: true,
        circleId: circle.id,
        assignedPosition,
        isActivated: isNowFull,
        message: isNowFull
          ? `Circle is now full and automatically ACTIVATED! Round 1 is live.`
          : `Successfully joined ${circle.name}! You are in payout position #${assignedPosition}.`,
      },
      { status: 201 }
    );

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

