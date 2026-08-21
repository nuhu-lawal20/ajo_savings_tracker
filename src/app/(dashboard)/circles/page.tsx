import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
  ChevronRight,
  KeyRound,
  CheckCircle2,
  Crown,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { AdminCircleCard } from "@/components/admin/AdminCircleCard";

export default async function CirclesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch logged in profile
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
  const dbClient = adminDb;

  // If in Operator View, fetch all circles for administrative audit
  if (isOperatorView) {
    const { data: allAdminCircles } = await adminDb
      .from("circles")
      .select("*, creator:profiles!circles_creator_id_fkey(full_name, email), memberships(id)")
      .order("created_at", { ascending: false });



    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        {/* Top Header for Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Savings Pools Oversight
              </h1>
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Governance Mode
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Platform-wide supervision of rotating savings pools, escrow audit, and risk controls.
            </p>
          </div>

          <Link href="/admin">
            <Button className="h-10 px-5 rounded-full bg-[#0F2744] hover:bg-[#0284C7] text-white font-black text-xs shadow-md transition-all hover:scale-105">
              <Crown className="mr-1.5 h-4 w-4 text-amber-400" />
              Admin Console
            </Button>
          </Link>
        </div>

        {/* Segregation of Duties Notice */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-500/30 text-xs flex items-start gap-3 shadow-xs">
          <ShieldCheck className="h-5 w-5 text-[#0284C7] dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black text-slate-900 dark:text-white text-xs">Segregation of Duties Policy Active</p>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-sky-200 font-medium">
              Administrative accounts are dedicated exclusively to platform oversight, escrow auditing, and fraud freeze controls. Admins cannot participate in consumer savings pools to prevent moral hazard.
            </p>
          </div>
        </div>


        {/* Global Circles List */}
        <div className="space-y-4">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span>All Platform Savings Pools</span>
            <span className="text-xs text-muted-foreground font-semibold">
              {allAdminCircles?.length ?? 0} Total Circles
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {allAdminCircles?.map((circle: any) => (
              <AdminCircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fetch user memberships for regular member / simulation view
  const { data: myMemberships } = await dbClient
    .from("memberships")
    .select("*, circle:circles!memberships_circle_id_fkey(*)")
    .eq("user_id", effectiveUserId);


  // Fetch public / open circles that are pending
  const joinedCircleIds = myMemberships?.map((m: any) => m.circle_id) ?? [];
  let openCirclesQuery = dbClient
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(full_name), memberships(id)")
    .eq("status", "pending")
    .limit(10);

  if (joinedCircleIds.length > 0) {
    openCirclesQuery = openCirclesQuery.not("id", "in", `(${joinedCircleIds.join(",")})`);
  }

  const { data: openCircles } = await openCirclesQuery;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Savings Circles (Adashe)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your active rotation circles or join open community pools.
          </p>
        </div>

        <Link href="/circles/create">
          <Button className="h-10 px-5 rounded-full bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-xs shadow-md shadow-sky-600/20 transition-all hover:scale-[1.02]">
            <Plus className="mr-1.5 h-4 w-4 text-white stroke-[3px]" />
            Create Circle
          </Button>
        </Link>
      </div>

      {/* Invite Code Quick Join Card */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                Have an Invite Code?
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Enter code to join a private group rotation instantly.
              </p>
            </div>
          </div>

          <form action="/join" method="GET" className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              name="code"
              placeholder="e.g. KADASHE-9X2P"
              required
              className="h-10 px-4 rounded-full border border-[#e1e8f0] dark:border-sky-500/30 bg-[#f4f7fb] dark:bg-sky-950/40 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-slate-900 dark:text-white w-full sm:w-48"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shrink-0"
            >
              Join Pool
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Advice & Anti-Impersonation Warning */}
      <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
        <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-amber-900 dark:text-amber-200">
              Security Advice: Always Join Peer Groups by Invite Code or Join Link
            </p>
            <Link href="/how-it-works" className="text-[11px] font-bold text-[#0284C7] dark:text-sky-400 hover:underline">
              Learn why →
            </Link>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Multiple informal pools may share similar names. To guarantee you join your exact intended cohort and not a look-alike pool, always use the 6-character code (e.g. <span className="font-mono font-bold text-slate-900 dark:text-white">KADASHE-XXXXXX</span>) provided by your verified organizer.
          </p>
        </div>
      </div>

      {/* Section 1: My Circles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>My Active Circles</span>
            <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {myMemberships?.length ?? 0}
            </Badge>
          </h2>
        </div>

        {!myMemberships || myMemberships.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-8 text-center">
            <p className="text-xs text-muted-foreground">You haven't joined any savings circles yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myMemberships.map((m: any) => {
              const circle = m.circle;
              if (!circle) return null;
              const isActive = circle.status === "active";

              return (
                <Card
                  key={m.id}
                  className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-[#e1e8f0] dark:border-sky-500/20 text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5">
                        {circle.frequency}
                      </Badge>
                      <Badge
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-sky-100 text-[#0284C7] dark:bg-sky-500/20 dark:text-sky-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                        }`}
                      >
                        {circle.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {circle.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {circle.description || "Peer-to-peer rotating savings pool"}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Payout Turn</span>
                        <span className="font-black text-[#0284C7] dark:text-sky-400">
                          Position #{m.payout_position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contribution</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₦{Number(circle.contribution_amount).toLocaleString()} / round
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e1e8f0]/60 dark:border-sky-500/15">
                    <Link href={`/circles/${m.circle_id}`} className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full font-bold text-xs border-[#e1e8f0] dark:border-sky-500/20 hover:bg-sky-50 dark:hover:bg-sky-500/10 text-[#0284C7] dark:text-sky-300"
                      >
                        View Transparency Ledger
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Open Community Circles */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            Open Community Circles
          </h2>
          <span className="text-[11px] text-muted-foreground font-semibold">
            {openCircles?.length ?? 0} pools looking for members
          </span>
        </div>

        {!openCircles || openCircles.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-8 text-center">
            <p className="text-xs text-muted-foreground">No open circles waiting for members right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openCircles.map((c: any) => {
              const currentMembers = c.memberships?.length ?? 0;
              const slotsLeft = c.max_members - currentMembers;
              const totalPayout = Number(c.contribution_amount) * c.max_members;

              return (
                <Card
                  key={c.id}
                  className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-[#e1e8f0] dark:border-sky-500/20 text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5">
                        {c.frequency}
                      </Badge>
                      <Badge className="bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold rounded-full px-2.5 py-0.5">
                        {slotsLeft} slots remaining
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Creator: {c.creator?.full_name ?? "Member"}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Payout Pool</span>
                        <span className="font-black text-[#0284C7] dark:text-sky-400">
                          ₦{totalPayout.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contribution</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₦{Number(c.contribution_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e1e8f0]/60 dark:border-sky-500/15">
                    <Link href={`/join/${c.invite_code}`} className="block">
                      <Button
                        size="sm"
                        className="w-full rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs"
                      >
                        Join Circle
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
