import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminCircleCard } from "@/components/admin/AdminCircleCard";
import { AdminUserManagement, AdminUser } from "@/components/admin/AdminUserManagement";
import {
  Crown,
  Users,
  CircleDollarSign,
  Receipt,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminConsolePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_admin, admin_role, full_name, email")
    .eq("id", user.id)
    .single();

  const isSuperAdmin = profile?.admin_role === "super_admin" || (profile?.is_admin && profile?.admin_role !== "helper_admin");
  const isHelperAdmin = profile?.admin_role === "helper_admin";

  if (!profile?.is_admin && !isSuperAdmin && !isHelperAdmin) {
    redirect("/dashboard");
  }

  // Fetch Platform Metrics using Admin Client to bypass RLS limits
  const adminDb = createAdminClient();

  const { count: totalUsers } = await adminDb
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalCircles } = await adminDb
    .from("circles")
    .select("*", { count: "exact", head: true });

  const { count: totalTransactions } = await adminDb
    .from("transactions")
    .select("*", { count: "exact", head: true });

  // Fetch all circles with creator and memberships count
  const { data: allCircles } = await adminDb
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(full_name, email), memberships(id)")
    .order("created_at", { ascending: false })
    .limit(20);

  // Fetch all users
  const { data: allUsersRaw } = await adminDb
    .from("profiles")
    .select("id, full_name, email, phone, trust_score, kyc_tier, is_admin, admin_role, is_suspended, created_at, avatar_url")
    .order("created_at", { ascending: false });

  const formattedUsers: AdminUser[] = (allUsersRaw || []).map((u: any) => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    phone: u.phone,
    trust_score: u.trust_score ?? 50,
    kyc_tier: u.kyc_tier ?? 1,
    is_admin: u.is_admin === true,
    admin_role: u.admin_role || (u.is_admin ? "super_admin" : "none"),
    is_suspended: u.is_suspended === true,
    created_at: u.created_at,
    avatar_url: u.avatar_url,
    created_circles_count: (allCircles || []).filter((c: any) => c.creator_id === u.id).length,
  }));


  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Admin Top Banner */}
      <div className={`relative rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden ${
        isSuperAdmin
          ? "bg-gradient-to-r from-amber-950/90 via-[#221703]/95 to-amber-950/90 border border-amber-500/30"
          : "bg-gradient-to-r from-sky-950/90 via-[#071322]/95 to-sky-950/90 border border-sky-500/30"
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Badge className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isSuperAdmin
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                  : "bg-sky-500/20 text-sky-300 border-sky-400/40"
              }`}>
                {isSuperAdmin ? (
                  <>
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    Super Admin Console
                  </>
                ) : (
                  <>
                    <Shield className="h-3.5 w-3.5 text-sky-400" />
                    Helper Admin (Moderator)
                  </>
                )}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Governance & Risk Terminal
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/80 max-w-xl font-medium leading-relaxed">
              {isSuperAdmin
                ? "Full authority: Manage helper admins, freeze/unfreeze circles, audit user trust scores, and enforce account suspensions."
                : "Operational moderation: Monitor savings circles, freeze high-risk pools, and suspend non-compliant users."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/circles">
              <button className="h-10 px-5 text-xs font-black rounded-full bg-white text-slate-950 hover:bg-sky-50 shadow-md flex items-center gap-2 transition-all hover:scale-105">
                <Users className="h-3.5 w-3.5 text-slate-950" />
                Pools Oversight →
              </button>
            </Link>
          </div>
        </div>
      </div>


      {/* Platform Metric Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Link href="#members-section" className="block">
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Total Members
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{totalUsers ?? 0}</div>
              <p className="text-[11px] text-muted-foreground font-medium">Registered Nigerian Profiles</p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Circles */}
        <Link href="/circles" className="block">
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Savings Circles
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400 flex items-center justify-center">
                <CircleDollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <div className="text-3xl font-black text-slate-900 dark:text-white">{totalCircles ?? 0}</div>
              <p className="text-[11px] text-muted-foreground font-medium">Active, Frozen & Pending Pools</p>
            </CardContent>
          </Card>
        </Link>

        {/* Escrow Transactions */}
        <Link href="/transactions" className="block">
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Escrow Operations
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Receipt className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{totalTransactions ?? 0}</div>
              <p className="text-[11px] text-muted-foreground font-medium">Confirmed Transactions</p>
            </CardContent>
          </Card>
        </Link>

        {/* System Health */}
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Platform Health
            </CardTitle>
            <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="text-3xl font-black text-[#0284C7] dark:text-sky-400">100%</div>
            <p className="text-[11px] text-[#0284C7] dark:text-sky-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> All Services Operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left: All Circles Inspector with Freeze / Unfreeze / Activate */}
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-[#0284C7] dark:text-sky-400" />
              <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Savings Circles Governance
              </CardTitle>
            </div>
            <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold">
              {allCircles?.length ?? 0} Listed
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {(!allCircles || allCircles.length === 0) ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No circles created yet.
              </div>
            ) : (
              allCircles.map((circle: any) => (
                <AdminCircleCard key={circle.id} circle={circle} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Right: Interactive User Directory & RBAC Suspensions */}
        <Card id="members-section" className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0284C7] dark:text-sky-400" />
              <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Member Directory & RBAC
              </CardTitle>
            </div>
            <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-[10px] font-bold">
              {formattedUsers.length} Profiles
            </Badge>
          </CardHeader>
          <CardContent className="p-4">
            <AdminUserManagement
              users={formattedUsers}
              currentOperator={{
                id: user.id,
                isSuperAdmin: !!isSuperAdmin,
                isHelperAdmin: !!isHelperAdmin,
              }}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

