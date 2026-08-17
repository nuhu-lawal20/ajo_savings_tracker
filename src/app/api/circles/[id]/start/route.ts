import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: circleId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch circle to verify ownership
  const { data: circle, error: fetchError } = await supabase
    .from("circles")
    .select("*, memberships(id)")
    .eq("id", circleId)
    .single();

  if (fetchError || !circle) {
    return NextResponse.json({ error: "Circle not found" }, { status: 404 });
  }

  if (circle.creator_id !== user.id) {
    return NextResponse.json({ error: "Only the circle creator can activate this rotation" }, { status: 403 });
  }

  if (circle.status !== "pending") {
    return NextResponse.json({ error: `Circle is already in ${circle.status} state` }, { status: 400 });
  }

  const memberCount = circle.memberships?.length ?? 0;
  if (memberCount < 2) {
    return NextResponse.json({ error: "At least 2 members are required to start a savings circle" }, { status: 400 });
  }

  // Update status to active
  const { error: updateError } = await supabase
    .from("circles")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", circleId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Circle rotation is now active!" });
}
