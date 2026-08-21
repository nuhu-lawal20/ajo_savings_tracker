import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Wallet, ShieldCheck, ArrowDownLeft, Activity } from "lucide-react";
import { PoolsLiveLedger, PoolCircle } from "@/components/transactions/PoolsLiveLedger";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: loggedProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const isAdmin = loggedProfile?.is_admin === true;
  const isSuperAdmin =
    loggedProfile?.admin_role === "super_admin" ||
    (loggedProfile?.is_admin && loggedProfile?.admin_role !== "helper_admin");

  // Check for simulation
  const cookieStore = await cookies();
  const simId = cookieStore.get("kadashe_simulation_id")?.value;

  let effectiveUserId = user!.id;
  let isSimulated = false;

  if (simId && isSuperAdmin) {
    effectiveUserId = simId;
    isSimulated = true;
  }

  const isOperatorView = isAdmin && !isSimulated;
  const adminDb = createAdminClient();

  let poolsData: PoolCircle[] = [];

  if (isOperatorView) {
    // ── Admin: Fetch all active platform circles, their members, and all transactions ──
    const { data: allCircles } = await adminDb
      .from("circles")
      .select("id, name, current_round, contribution_amount, max_members, status")
      .order("created_at", { ascending: false });

    if (allCircles && allCircles.length > 0) {
      const circleIds = allCircles.map((c) => c.id);

      const [{ data: allMembers }, { data: allTransactions }] = await Promise.all([
        adminDb
          .from("memberships")
          .select("id, user_id, circle_id, has_paid_current_round, payout_position, profile:profiles(id, full_name, avatar_url, trust_score)")
          .in("circle_id", circleIds),
        adminDb
          .from("transactions")
          .select("id, user_id, circle_id, amount, round_number, type, status, paystack_reference, source, created_at, profile:profiles(id, full_name, avatar_url), circle:circles(name)")
          .in("circle_id", circleIds)
          .order("created_at", { ascending: false }),
      ]);

      poolsData = allCircles.map((c) => ({
        id: c.id,
        name: c.name,
        current_round: c.current_round,
        contribution_amount: Number(c.contribution_amount),
        max_members: c.max_members,
        status: c.status,
        members: (allMembers ?? []).filter((m: any) => m.circle_id === c.id) as any[],
        transactions: (allTransactions ?? []).filter((t: any) => t.circle_id === c.id),
      }));
    }
  } else {
    // ── Member / Simulated Member: Fetch all circles this user has joined ──
    const { data: userMemberships } = await adminDb
      .from("memberships")
      .select("circle_id")
      .eq("user_id", effectiveUserId);

    const userCircleIds = userMemberships?.map((m) => m.circle_id) ?? [];

    if (userCircleIds.length > 0) {
      const [{ data: userCircles }, { data: circleMembers }, { data: circleTransactions }] = await Promise.all([
        adminDb
          .from("circles")
          .select("id, name, current_round, contribution_amount, max_members, status")
          .in("id", userCircleIds),
        adminDb
          .from("memberships")
          .select("id, user_id, circle_id, has_paid_current_round, payout_position, profile:profiles(id, full_name, avatar_url, trust_score)")
          .in("circle_id", userCircleIds),
        adminDb
          .from("transactions")
          .select("id, user_id, circle_id, amount, round_number, type, status, paystack_reference, source, created_at, profile:profiles(id, full_name, avatar_url), circle:circles(name)")
          .in("circle_id", userCircleIds)
          .order("created_at", { ascending: false }),
      ]);

      poolsData = (userCircles ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        current_round: c.current_round,
        contribution_amount: Number(c.contribution_amount),
        max_members: c.max_members,
        status: c.status,
        members: (circleMembers ?? []).filter((m: any) => m.circle_id === c.id) as any[],
        transactions: (circleTransactions ?? []).filter((t: any) => t.circle_id === c.id),
      }));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isOperatorView ? "Platform Pool Escrow & Treasury Audit" : "Pools Escrow & Live Ledger"}
            </h1>
            {isOperatorView ? (
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Audit Mode
              </Badge>
            ) : (
              <Badge className="bg-sky-500/15 text-[#0284C7] dark:text-sky-300 border-sky-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Activity className="h-3 w-3 animate-pulse" />
                Live Feed
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isOperatorView
              ? "Platform-wide cryptographic ledger tracking all pool contributions, pending deposits, and rotational disbursements."
              : "Live transparency for your savings pools — track round escrow targets, see who has paid, who is pending, and live peer receipts."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isOperatorView && (
            <Link href="/wallet">
              <Button className="h-10 px-5 rounded-full bg-[#0F2744] hover:bg-[#0284C7] text-white font-black text-xs shadow-md transition-all hover:scale-105">
                <Wallet className="mr-1.5 h-4 w-4 text-sky-300" />
                My Wallet
              </Button>
            </Link>
          )}

          {isOperatorView ? (
            <Link href="/admin">
              <Button className="h-10 px-5 rounded-full bg-[#0F2744] hover:bg-[#0284C7] text-white font-black text-xs shadow-md transition-all hover:scale-105">
                <Crown className="mr-1.5 h-4 w-4 text-amber-400" />
                Admin Console
              </Button>
            </Link>
          ) : (
            <Link href="/circles">
              <Button className="h-10 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs shadow-md shadow-sky-600/20 transition-all">
                <Users className="mr-1.5 h-4 w-4" />
                Explore Pools
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── INTERACTIVE MULTI-POOL LIVE ESCROW & GLASS LEDGER ── */}
      <PoolsLiveLedger
        pools={poolsData}
        currentUserId={effectiveUserId}
        isOperatorView={isOperatorView}
      />
    </div>
  );
}
