import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate caller is Super Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, admin_role")
    .eq("id", user.id)
    .single();

  const isSuperAdmin =
    profile?.admin_role === "super_admin" ||
    (profile?.is_admin && profile?.admin_role !== "helper_admin");

  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Only Super Admin can enter member simulation mode." },
      { status: 403 }
    );
  }

  try {
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    const adminDb = createAdminClient();
    const { data: targetProfile, error: targetError } = await adminDb
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", targetUserId)
      .single();

    if (targetError || !targetProfile) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Set simulation cookie (1 hour expiry)
    const cookieStore = await cookies();
    cookieStore.set("kadashe_simulation_id", targetUserId, {
      path: "/",
      httpOnly: false, // accessible to client for instant UI banner reactivity
      maxAge: 3600,
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: `Simulation mode active for ${targetProfile.full_name}`,
      simulatedUser: targetProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("kadashe_simulation_id");

  return NextResponse.json({
    success: true,
    message: "Simulation mode exited.",
  });
}
