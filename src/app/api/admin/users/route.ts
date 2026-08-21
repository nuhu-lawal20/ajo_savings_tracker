import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  // 1. Fetch Operator's Profile & RBAC Role
  const { data: operatorProfile } = await supabase
    .from("profiles")
    .select("id, email, is_admin, admin_role")
    .eq("id", user.id)
    .single();

  const isSuperAdmin = operatorProfile?.admin_role === "super_admin" || (operatorProfile?.is_admin && operatorProfile?.admin_role !== "helper_admin");
  const isHelperAdmin = operatorProfile?.admin_role === "helper_admin";

  if (!isSuperAdmin && !isHelperAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
  }

  try {
    const { targetUserId, email, action } = await request.json();

    if ((!targetUserId && !email) || !action) {
      return NextResponse.json({ error: "targetUserId or email, and action are required" }, { status: 400 });
    }

    // 2. Fetch Target User's Profile (by ID or by Email)
    const adminDb = createAdminClient();
    let query = adminDb
      .from("profiles")
      .select("id, email, full_name, is_admin, admin_role, is_suspended");

    if (targetUserId) {
      query = query.eq("id", targetUserId);
    } else if (email) {
      query = query.eq("email", email.toLowerCase().trim());
    }

    const { data: targetUser, error: targetFetchError } = await query.single();

    if (targetFetchError || !targetUser) {
      return NextResponse.json(
        { error: email ? `No user found with email "${email}". They must register an account first.` : "Target user not found" },
        { status: 404 }
      );
    }


    // 3. IMMUNITY RULE: Super Admin can NEVER be suspended or demoted by anyone
    const targetIsSuperAdmin = targetUser.admin_role === "super_admin" || (targetUser.is_admin && targetUser.admin_role !== "helper_admin");
    if (targetIsSuperAdmin) {
      return NextResponse.json(
        { error: "Security Immunity: Super Admin accounts cannot be suspended, paused, or altered." },
        { status: 403 }
      );
    }

    // 4. HELPER ADMIN RESTRICTIONS:
    // Helper Admins cannot promote/demote or suspend another Helper Admin
    if (isHelperAdmin) {
      if (action === "promote_helper" || action === "demote_helper") {
        return NextResponse.json(
          { error: "Permission Denied: Only Super Admin can promote or demote helper admins." },
          { status: 403 }
        );
      }
      if (targetUser.admin_role === "helper_admin") {
        return NextResponse.json(
          { error: "Permission Denied: Helper Admins cannot suspend fellow administrators." },
          { status: 403 }
        );
      }
    }

    // 5. Execute Action
    let updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    let successMessage = "";

    switch (action) {
      case "suspend":
        updatePayload.is_suspended = true;
        successMessage = `Account "${targetUser.full_name}" (${targetUser.email}) has been SUSPENDED.`;
        break;

      case "unsuspend":
        updatePayload.is_suspended = false;
        successMessage = `Account "${targetUser.full_name}" has been REACTIVATED.`;
        break;

      case "promote_helper":
        if (!isSuperAdmin) {
          return NextResponse.json({ error: "Only Super Admin can assign helper admin role." }, { status: 403 });
        }
        updatePayload.admin_role = "helper_admin";
        updatePayload.is_admin = true;
        successMessage = `Account "${targetUser.full_name}" has been promoted to HELPER ADMIN (Moderator).`;
        break;

      case "demote_helper":
        if (!isSuperAdmin) {
          return NextResponse.json({ error: "Only Super Admin can revoke helper admin role." }, { status: 403 });
        }
        updatePayload.admin_role = "none";
        updatePayload.is_admin = false;
        successMessage = `Account "${targetUser.full_name}" has been demoted to regular member.`;
        break;

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const { error: updateError } = await adminDb
      .from("profiles")
      .update(updatePayload as any)
      .eq("id", targetUserId);


    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: successMessage,
      targetUserId,
      updatedFields: updatePayload,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// Direct Helper Admin Account Creation by Super Admin
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  // Check that caller is Super Admin
  const { data: operatorProfile } = await supabase
    .from("profiles")
    .select("id, email, is_admin, admin_role")
    .eq("id", user.id)
    .single();

  const isSuperAdmin =
    operatorProfile?.admin_role === "super_admin" ||
    (operatorProfile?.is_admin && operatorProfile?.admin_role !== "helper_admin");

  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Access Denied: Only the Super Admin can create and provision Helper Admin accounts." },
      { status: 403 }
    );
  }

  try {
    const { fullName, email, phone } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: "Full Name and Email are required to create an admin account." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanFullName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : null;

    const adminDb = createAdminClient();

    // 1. Create or Find User in Auth
    let targetAuthUserId: string | null = null;

    const { data: createAuthData, error: createAuthError } = await adminDb.auth.admin.createUser({
      email: cleanEmail,
      email_confirm: true,
      user_metadata: {
        full_name: cleanFullName,
        phone: cleanPhone,
      },
    });

    if (createAuthError) {
      // If user already exists in auth.users, fetch their ID
      if (createAuthError.message.toLowerCase().includes("already registered") || createAuthError.message.toLowerCase().includes("already exists")) {
        const { data: existingProfile } = await adminDb
          .from("profiles")
          .select("id")
          .eq("email", cleanEmail)
          .single();

        if (existingProfile) {
          targetAuthUserId = existingProfile.id;
        } else {
          return NextResponse.json({ error: `Auth error: ${createAuthError.message}` }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: createAuthError.message }, { status: 400 });
      }
    } else if (createAuthData?.user) {
      targetAuthUserId = createAuthData.user.id;
    }

    if (!targetAuthUserId) {
      return NextResponse.json({ error: "Failed to determine target user ID." }, { status: 500 });
    }

    // 2. Upsert profile with Helper Admin status & Master Verified Tier
    const { error: upsertError } = await adminDb
      .from("profiles")
      .upsert({
        id: targetAuthUserId,
        email: cleanEmail,
        full_name: cleanFullName,
        phone: cleanPhone,
        is_admin: true,
        admin_role: "helper_admin",
        trust_score: 100,
        kyc_tier: 2,
        is_suspended: false,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: "id" });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: `Helper Admin account successfully created for ${cleanFullName} (${cleanEmail})! They can now log in immediately via OTP.`,
      user: {
        id: targetAuthUserId,
        email: cleanEmail,
        fullName: cleanFullName,
        role: "helper_admin",
      },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

