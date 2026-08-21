import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { SimulationBanner } from "@/components/admin/SimulationBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch logged in user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url, trust_score, kyc_tier, is_admin, admin_role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin === true;
  const isSuperAdmin =
    profile?.admin_role === "super_admin" ||
    (profile?.is_admin && profile?.admin_role !== "helper_admin");

  // Check if in simulation mode
  const cookieStore = await cookies();
  const simId = cookieStore.get("kadashe_simulation_id")?.value;
  let simulatedUser = null;

  if (simId && isSuperAdmin) {
    const adminDb = createAdminClient();
    const { data: simProfile } = await adminDb
      .from("profiles")
      .select("id, full_name, email, phone, avatar_url, trust_score, kyc_tier, is_admin, admin_role")
      .eq("id", simId)
      .single();

    if (simProfile) {
      simulatedUser = simProfile;
    }
  }

  // Active profile to pass into UI (simulated user if active, otherwise real logged in user)
  const activeProfile = simulatedUser || profile;

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#071322] text-slate-900 dark:text-white antialiased">
      {/* Super Admin Read-Only Simulation Banner */}
      {simulatedUser && <SimulationBanner simulatedUser={simulatedUser} />}

      {/* Desktop Left Sidebar (>= lg) */}
      <Sidebar userProfile={activeProfile} />

      {/* Mobile Top Header (< lg) */}
      <MobileTopBar userProfile={activeProfile} />

      {/* Main Content Area */}
      <main className="lg:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 max-w-[1360px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (< lg) */}
      <BottomNav isAdmin={activeProfile?.is_admin === true} />
    </div>
  );
}

