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

    // Generate unique 8-character invite code (e.g. ALAJO-9X2P)
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const inviteCode = `ALAJO-${randomHex}`;

    // Insert Circle
    const { data: circle, error: circleError } = await supabase
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

    // Auto-assign Creator as Member #1 (Payout Position 1)
    const { error: memberError } = await supabase.from("memberships").insert({
      circle_id: circle.id,
      user_id: user.id,
      payout_position: 1,
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
