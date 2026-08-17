import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { JoinCircleSchema } from "@/lib/validations";

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

    // 1. Fetch circle by invite code
    const { data: circle, error: circleError } = await supabase
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

    // 2. Fetch User's Trust Score
    const { data: profile } = await supabase
      .from("profiles")
      .select("trust_score")
      .eq("id", user.id)
      .single();

    const trustScore = profile?.trust_score ?? 50;

    // 3. Determine available payout positions (1 to max_members)
    const takenPositions = new Set(currentMembers.map((m: any) => m.payout_position));
    const allPositions = Array.from({ length: circle.max_members }, (_, i) => i + 1);
    const availablePositions = allPositions.filter((pos) => !takenPositions.has(pos));

    if (availablePositions.length === 0) {
      return NextResponse.json({ error: "No available payout positions remaining" }, { status: 400 });
    }

    let assignedPosition: number;

    // AI Reputation Algorithm for Payout Slots:
    // Low Trust (<40) -> Assigned later slots to safeguard pooled capital
    // High Trust (>=70) -> Priority access to earliest slots
    // Medium Trust (40-69) -> Standard rotation
    if (trustScore < 40) {
      // Pick highest available position number (last in line)
      assignedPosition = availablePositions[availablePositions.length - 1];
    } else if (trustScore >= 70) {
      // Pick lowest available position number (earliest in line)
      assignedPosition = availablePositions[0];
    } else {
      // Standard distribution
      assignedPosition = availablePositions[0];
    }

    // 4. Insert Membership
    const { data: membership, error: joinError } = await supabase
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

    return NextResponse.json(
      {
        success: true,
        circleId: circle.id,
        assignedPosition,
        message: `Successfully joined ${circle.name}! You are in payout position #${assignedPosition}.`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
