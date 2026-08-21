import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sortMembersForPayoutQueue } from "@/lib/payout-queue";

async function handleCircleAction(circleId: string, action?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  // Fetch circle with memberships and creator
  const { data: circle, error: fetchError } = await supabase
    .from("circles")
    .select("*, memberships(id)")
    .eq("id", circleId)
    .single();

  if (fetchError || !circle) {
    return NextResponse.json({ error: "Circle not found" }, { status: 404 });
  }

  // Fetch user profile to check Admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, admin_role, trust_score")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin === true || profile?.admin_role === "super_admin" || profile?.admin_role === "helper_admin";
  const isCreator = circle.creator_id === user.id;

  if (!isCreator && !isAdmin) {
    return NextResponse.json(
      { error: "Only the circle organizer or authorized admin can manage this rotation" },
      { status: 403 }
    );
  }

  // Determine target status
  let newStatus: string = "active";
  let statusMessage: string = "";

  if (action === "freeze") {
    if (!isAdmin) {
      return NextResponse.json({ error: "Only platform admins can freeze circles" }, { status: 403 });
    }
    newStatus = "frozen";
    statusMessage = `Circle "${circle.name}" has been FROZEN by Admin. Contributions and payouts are paused.`;
  } else if (action === "unfreeze") {
    if (!isAdmin) {
      return NextResponse.json({ error: "Only platform admins can unfreeze circles" }, { status: 403 });
    }
    newStatus = "active";
    statusMessage = `Circle "${circle.name}" has been UNFROZEN and restored to active state.`;
  } else if (action === "cancel") {
    newStatus = "cancelled";
    statusMessage = `Circle "${circle.name}" has been cancelled.`;
  } else {
    // Standard start / activate
    if (circle.status !== "pending" && circle.status !== "frozen") {
      return NextResponse.json({ error: `Circle is already in ${circle.status} state` }, { status: 400 });
    }
    const memberCount = circle.memberships?.length ?? 0;
    if (!isAdmin && memberCount < 2) {
      return NextResponse.json(
        { error: "At least 2 members are required before starting the rotation" },
        { status: 400 }
      );
    }
    newStatus = "active";
    statusMessage = isAdmin
      ? `Circle "${circle.name}" has been activated by Admin.`
      : `Circle "${circle.name}" is now active! Round 1 contributions are open.`;

    // Re-rank all members by AI trust score descending to assign earned payout queue positions
    const adminDb = createAdminClient();
    const { data: memberList } = await adminDb
      .from("memberships")
      .select("id, user_id, joined_at, profile:profiles!user_id(trust_score)")
      .eq("circle_id", circleId);

    if (memberList && memberList.length > 0) {
      const sorted = sortMembersForPayoutQueue(memberList as any, circle.creator_id);

      // High offset first to bypass unique key constraint
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
  }

  // Use Admin Service Role client if admin action, else standard client
  const db = isAdmin ? createAdminClient() : supabase;

  const { error: updateError } = await db
    .from("circles")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", circleId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }


  // Invalidate cached pages
  revalidatePath("/admin");
  revalidatePath("/circles");
  revalidatePath(`/circles/${circleId}`);
  revalidatePath("/dashboard");

  return NextResponse.json({
    success: true,
    status: newStatus,
    message: statusMessage,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let action: string | undefined;
  try {
    const body = await request.json();
    action = body.action;
  } catch {
    // Body is optional
  }
  return handleCircleAction(id, action);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let action: string | undefined;
  try {
    const body = await request.json();
    action = body.action;
  } catch {
    // Body is optional
  }
  return handleCircleAction(id, action);
}


