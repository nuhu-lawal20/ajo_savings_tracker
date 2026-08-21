import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Plus,
  Users,
  ArrowRight,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  PiggyBank,
  Wallet,
  Share2,
  Headphones,
  Award,
  ChevronRight,
  Eye,
  Store,
  Crown,
} from "lucide-react";

import { DesktopLiveLedgerPanel } from "@/components/dashboard/DesktopLiveLedgerPanel";
import { BalanceCard } from "@/components/dashboard/BalanceCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch logged-in user profile
  const { data: loggedProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isSuperAdmin =
    loggedProfile?.admin_role === "super_admin" ||
    (loggedProfile?.is_admin && loggedProfile?.admin_role !== "helper_admin");
  const isHelperAdmin = loggedProfile?.admin_role === "helper_admin";
  const isAdmin = isSuperAdmin || isHelperAdmin;


  // Check for Super Admin simulation
  const cookieStore = await cookies();
  const simId = cookieStore.get("kadashe_simulation_id")?.value;

  let effectiveUserId = user.id;
  let effectiveProfile = loggedProfile;

  if (simId && isSuperAdmin) {
    const adminDb = createAdminClient();
    const { data: simProfile } = await adminDb
      .from("profiles")
      .select("*")
      .eq("id", simId)
      .single();
    if (simProfile) {
      effectiveUserId = simProfile.id;
      effectiveProfile = simProfile;
    }
  } else if (isAdmin) {
    // Admin accounts route directly to Governance & Moderation Console
    redirect("/admin");
  }

  const profile = effectiveProfile;
  const adminDb = createAdminClient();

  // Fetch user's circles & memberships using Admin client for reliable join resolution
  const { data: memberships } = await adminDb
    .from("memberships")
    .select("*, circle:circles!memberships_circle_id_fkey(*)")
    .eq("user_id", effectiveUserId);

  // Fetch user's personal recent transactions (Circle contributions & payouts)
  const { data: circleTransactions } = await adminDb
    .from("transactions")
    .select("*, circle:circles!transactions_circle_id_fkey(name)")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch user's personal wallet entries (Top-ups, Withdrawals)
  const { data: walletEntries } = await adminDb
    .from("wallet_ledger")
    .select("*")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false })
    .limit(6);

  // Merge into unified latest activity list
  const unifiedRecentActivity: any[] = [];
  (walletEntries ?? []).forEach((w: any) => {
    if (w.type === "fund") {
      unifiedRecentActivity.push({
        id: `wallet_${w.id}`,
        title: "Wallet Top-Up",
        subtitle: w.description || "Wallet top-up via Paystack",
        amount: Number(w.amount),
        direction: "credit",
        status: w.status,
        date: w.created_at,
        source: "Wallet Top-Up",
      });
    } else if (w.type === "withdraw") {
      unifiedRecentActivity.push({
        id: `wallet_${w.id}`,
        title: "Bank Withdrawal",
        subtitle: w.description || "Disbursement to linked bank account",
        amount: Number(w.amount),
        direction: "debit",
        status: w.status,
        date: w.created_at,
        source: "Bank Transfer",
      });
    }
  });

  (circleTransactions ?? []).forEach((tx: any) => {
    const isContribution = tx.type === "contribution";
    const circleName = (tx.circle as any)?.name || "Adashe Pool";
    unifiedRecentActivity.push({
      id: `tx_${tx.id}`,
      title: isContribution ? `Contribution: ${circleName}` : `Escrow Payout: ${circleName}`,
      subtitle: `Round #${tx.round_number || 1} (${tx.source === "wallet" ? "Paid from Wallet" : "Paid via Paystack"})`,
      amount: Number(tx.amount),
      direction: isContribution ? "debit" : "credit",
      status: tx.status,
      date: tx.created_at,
      source: isContribution ? (tx.source === "wallet" ? "Wallet" : "Paystack") : "Pool Escrow",
    });
  });

  unifiedRecentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Fetch public live stream transactions for DesktopLiveLedgerPanel
  const { data: liveLedgerTransactions } = await adminDb
    .from("transactions")
    .select("*, circle:circles!transactions_circle_id_fkey(name), profile:profiles!transactions_user_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(8);

  const { count: totalActivePlatformCircles } = await adminDb
    .from("circles")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const trustScore = profile?.trust_score ?? 50;
  const kycTier = profile?.kyc_tier ?? 1;
  const activeCircles = memberships?.filter((m: any) => m.circle?.status === "active") ?? [];
  const pendingCircles = memberships?.filter((m: any) => m.circle?.status === "pending") ?? [];

  // Calculate total active rotation value
  const totalPooledCapital = memberships?.reduce(
    (acc: number, m: any) => acc + (m.circle?.contribution_amount ?? 0) * (m.circle?.max_members ?? 0),
    0
  ) ?? 0;

  const totalContributionsPaid = circleTransactions
    ?.filter((t: any) => t.type === "contribution" && t.status === "confirmed")
    ?.reduce((acc: number, t: any) => acc + (t.amount ?? 0), 0) ?? 0;

  // Fetch real wallet balance from the wallet_balances derived view (Phase 11)
  const { data: walletBalanceRow } = await adminDb
    .from("wallet_balances")
    .select("available_balance")
    .eq("user_id", effectiveUserId)
    .single();

  const realWalletBalance = Number(walletBalanceRow?.available_balance ?? 0);

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 w-full pb-10">
      {/* Left Main Column: Dashboard Hub */}
      <div className="flex-1 w-full space-y-6 min-w-0">
      
      {/* ========================================================================= */}
      {/* 1. MAIN SOVEREIGN NAVY & ELECTRIC CYAN BALANCE CARD                       */}
      {/* ========================================================================= */}
      <BalanceCard
        walletBalance={realWalletBalance}
        lockedInAdashe={totalContributionsPaid}
        activeCirclesCount={activeCircles.length}
        totalPooledCapital={totalPooledCapital}
        targetCircleName={activeCircles[0]?.circle?.name}
        payoutPosition={activeCircles[0]?.payout_position}
      />

      {/* ========================================================================= */}
      {/* 2. RECENT PERSONAL ACTIVITY CARD (GLIMPSE OF PERSONAL STATEMENT)          */}
      {/* ========================================================================= */}
      {unifiedRecentActivity && unifiedRecentActivity.length > 0 ? (
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Recent Personal Activity
              </CardTitle>
              <CardDescription className="text-[11px]">
                Latest wallet funding, pool contributions, and payouts
              </CardDescription>
            </div>

            <Link href="/profile/transactions">
              <span className="text-xs font-bold text-[#0284C7] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                View Full Statement →
              </span>
            </Link>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
            {unifiedRecentActivity.slice(0, 2).map((item: any) => {
              const isCredit = item.direction === "credit";
              const isConfirmed = item.status === "confirmed" || item.status === "settled";

              return (
                <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between text-xs hover:bg-[#f4f7fb]/50 dark:hover:bg-sky-950/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4 stroke-[2.5px]" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 stroke-[2.5px]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-600 dark:text-slate-300 text-[8px] font-bold px-1.5 py-0 border-0 rounded">
                          {item.source}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(item.date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3 space-y-0.5">
                    <p
                      className={`font-black text-xs ${
                        !isConfirmed
                          ? "text-muted-foreground line-through"
                          : isCredit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {isCredit ? "+" : "−"}₦{item.amount?.toLocaleString()}
                    </p>
                    <Badge
                      className={`text-[8px] uppercase font-bold rounded-full px-1.5 py-0 border-0 ${
                        isConfirmed
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : item.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                          : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardContent className="p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Escrow Ready & Protected</p>
                <p className="text-[11px] text-muted-foreground">Zero defaults recorded. Join or create a circle to start.</p>
              </div>
            </div>
            <Link href="/circles">
              <Button size="sm" variant="outline" className="text-xs font-bold rounded-full border-[#e1e8f0] text-[#0F2744] hover:bg-sky-50">
                Join Circle
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. YOUR ACTIVE SAVINGS CIRCLES (MOVED UP FOR QUICK ACCESS)                 */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            My Savings Circles ({memberships?.length ?? 0})
          </h2>
          <Link href="/circles" className="text-xs font-bold text-[#0284C7] dark:text-sky-400 hover:underline">
            View All Circles →
          </Link>
        </div>

        {memberships && memberships.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memberships.map((m: any) => {
              const circle = m.circle;
              if (!circle) return null;
              const isActive = circle.status === "active";

              return (
                <Link key={m.id} href={`/circles/${circle.id}`} className="block">
                  <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-5 shadow-sm hover:shadow-md hover:border-sky-400/50 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                            {circle.name}
                          </h3>
                          <Badge
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-sky-100 text-[#0284C7] dark:bg-sky-500/20 dark:text-sky-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            }`}
                          >
                            {circle.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ₦{circle.contribution_amount?.toLocaleString()} • {circle.frequency}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground font-semibold">Your Slot</span>
                        <p className="text-sm font-black text-[#0284C7] dark:text-sky-400">
                          #{m.payout_position}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e1e8f0]/60 dark:border-sky-500/15 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Capacity: {circle.max_members} members
                      </span>
                      <span className="font-bold text-[#0284C7] dark:text-sky-400 flex items-center gap-1">
                        View Circle Room <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="rounded-3xl border border-dashed border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">You haven't joined any circle yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Create your own Adashe circle or enter an invite code to start rotating savings today.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/circles/create">
                <Button size="sm" className="rounded-full font-bold text-xs bg-[#0284C7] hover:bg-[#0369A1] text-white">
                  + Create Circle
                </Button>
              </Link>
              <Link href="/circles">
                <Button size="sm" variant="outline" className="rounded-full font-bold text-xs border-[#e1e8f0]">
                  Join via Code
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. PRIMARY 4-ACTION QUICK HUB                                             */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Action 1: Create Circle */}
            <Link href="/circles/create" className="flex flex-col items-center gap-2 group">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                <Plus className="h-6 w-6 stroke-[2.5px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Create Circle
              </span>
            </Link>

            {/* Action 2: Join via Code */}
            <Link href="/circles" className="flex flex-col items-center gap-2 group">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-300 flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                <Users className="h-6 w-6 stroke-[2.2px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Join Pool
              </span>
            </Link>

            {/* Action 3: Finance / Ledger */}
            <Link href="/transactions" className="flex flex-col items-center gap-2 group">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                <Receipt className="h-6 w-6 stroke-[2.2px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pools Ledger
              </span>
            </Link>

            {/* Action 4: Admin Hub or Verify Identity */}
            {isAdmin ? (
              <Link href="/admin" className="flex flex-col items-center gap-2 group">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                  <Crown className="h-6 w-6 stroke-[2.2px]" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Admin Console
                </span>
              </Link>
            ) : (
              <Link href="/profile" className="flex flex-col items-center gap-2 group">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                  <Award className="h-6 w-6 stroke-[2.2px]" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {kycTier >= 2 ? "Tier 1 KYC" : "Unverified"}
                </span>
              </Link>
            )}

          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 5. SERVICES & SAVINGS BENTO GRID                                          */}
      {/* ========================================================================= */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-900 dark:text-white">
              Kadashe Financial Services
            </CardTitle>
            <span className="text-[11px] font-bold text-[#0284C7] dark:text-sky-400">
              100% Escrow Guaranteed
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
            {/* Service 1: Rotating Adashe */}
            <Link href="/circles" className="flex flex-col items-center gap-2 group">
              <div className="h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Adashe Pool
              </span>
            </Link>

            {/* Service 2: SafeBox Locked Vault */}
            <Link href="/coming-soon?feature=safebox" className="flex flex-col items-center gap-2 group">
              <div className="relative h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <Lock className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                  SOON
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                SafeBox Vault
              </span>
            </Link>

            {/* Service 3: Spend & Save */}
            <Link href="/coming-soon?feature=spend_save" className="flex flex-col items-center gap-2 group">
              <div className="relative h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <PiggyBank className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                  SOON
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Spend & Save
              </span>
            </Link>

            {/* Service 4: AI Trust Engine */}
            <Link href="/profile" className="flex flex-col items-center gap-2 group">
              <div className="h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Trust Score
              </span>
            </Link>

            {/* Service 5: Virtual Escrow Card */}
            <Link href="/coming-soon?feature=cards" className="flex flex-col items-center gap-2 group">
              <div className="relative h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <Wallet className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                  SOON
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Virtual Card
              </span>
            </Link>

            {/* Service 6: Airtime & Bills */}
            <Link href="/coming-soon?feature=bills" className="flex flex-col items-center gap-2 group">
              <div className="relative h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-all">
                <Receipt className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                  SOON
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Pay Bills
              </span>
            </Link>

            {/* Service 7: Admin Console or How It Works FAQ */}
            {isAdmin ? (
              <Link href="/admin" className="flex flex-col items-center gap-2 group">
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all ${
                  isSuperAdmin
                    ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400"
                }`}>
                  {isSuperAdmin ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {isSuperAdmin ? "Super Admin" : "Moderator"}
                </span>
              </Link>
            ) : (

              <Link href="/how-it-works" className="flex flex-col items-center gap-2 group">
                <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-all">
                  <Headphones className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  FAQ & Guide
                </span>
              </Link>
            )}

            {/* Service 8: Create New Circle */}
            <Link href="/circles/create" className="flex flex-col items-center gap-2 group">
              <div className="h-11 w-11 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
                <Plus className="h-5 w-5 stroke-[2.5px]" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                New Circle
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Right Column: Desktop Live Glass Ledger Showcase Panel (>= lg) */}
      <DesktopLiveLedgerPanel
        userProfile={profile}
        transactions={liveLedgerTransactions ?? circleTransactions ?? []}
        activeCirclesCount={totalActivePlatformCircles ?? activeCircles.length}
        totalPooledCapital={totalPooledCapital}
      />

    </div>
  );
}
