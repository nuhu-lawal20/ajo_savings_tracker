import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  Copy,
  Lock,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { InviteShareModal } from "@/components/circles/InviteShareModal";
import { PaymentButton } from "@/components/payments/PaymentButton";
import { GlassLedger } from "@/components/circles/GlassLedger";
import { MemberPayoutList } from "@/components/circles/MemberPayoutList";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const adminDb = createAdminClient();
  const { id: circleId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch circle details with creator using adminDb for guaranteed server-side resolution
  const { data: circle, error: circleError } = await adminDb
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(*)")
    .eq("id", circleId)
    .single();

  if (circleError || !circle) {
    notFound();
  }

  // Fetch members with profiles
  const { data: members } = await adminDb
    .from("memberships")
    .select("*, profile:profiles(*)")
    .eq("circle_id", circleId)
    .order("payout_position", { ascending: true });

  // Fetch transactions for glass ledger
  const { data: transactions } = await adminDb
    .from("transactions")
    .select("*, profile:profiles!user_id(full_name)")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false });


  const isCreator = circle.creator_id === user!.id;
  const currentMembersCount = members?.length ?? 0;
  const poolPerRound = Number(circle.contribution_amount) * circle.max_members;
  const userMembership = members?.find((m: any) => m.user_id === user!.id);


  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
        <div className="flex items-center gap-3">
          <Link href="/circles">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-sky-50 dark:hover:bg-sky-500/10">
              <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {circle.name}
              </h1>
              <Badge
                className={`text-[10px] font-bold uppercase rounded-full px-2 py-0 border-0 ${
                  circle.status === "active"
                    ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300"
                    : circle.status === "completed"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                    : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                }`}
              >
                {circle.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organized by <span className="font-semibold text-slate-800 dark:text-slate-200">{circle.creator?.full_name}</span> • Invite Code:{" "}
              <span className="font-mono font-bold text-[#0284C7] dark:text-sky-400">{circle.invite_code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InviteShareModal inviteCode={circle.invite_code} circleName={circle.name} />

          {circle.status === "active" && userMembership && !userMembership.has_paid_current_round && (
            <PaymentButton
              circleId={circle.id}
              amount={Number(circle.contribution_amount)}
              email={user!.email!}
              circleName={circle.name}
              membershipId={userMembership.id}
              roundNumber={circle.current_round}
            />
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Round Pool Payout
            </CardTitle>
            <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="text-2xl font-black text-[#0284C7] dark:text-sky-400">
              ₦{poolPerRound.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              ₦{Number(circle.contribution_amount).toLocaleString()} × {circle.max_members} members
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Rotation Cycle
            </CardTitle>
            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="text-2xl font-black capitalize text-slate-900 dark:text-white">{circle.frequency}</div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Round {circle.current_round} of {circle.max_members}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Members Joined
            </CardTitle>
            <div className="h-8 w-8 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {currentMembersCount} / {circle.max_members}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              {circle.max_members - currentMembersCount} open slots remaining
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              Escrow Protection
            </CardTitle>
            <div className="h-8 w-8 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">100% Locked</div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Zero Admin Direct Custody
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member Payout Schedule Order */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Rotation Payout Order
          </h2>
          <span className="text-[11px] font-semibold text-muted-foreground">
            Click any member to inspect Trust Dossier
          </span>
        </div>
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <MemberPayoutList
              members={members ?? []}
              currentUserId={user!.id}
              creatorId={circle.creator_id}
              contributionAmount={Number(circle.contribution_amount)}
              currentRound={circle.current_round}
            />
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Glass Ledger (live Supabase Realtime) */}
      <GlassLedger
        circleId={circle.id}
        initialTransactions={transactions ?? []}
        initialMembers={members ?? []}
        contributionAmount={Number(circle.contribution_amount)}
        maxMembers={circle.max_members}
        currentRound={circle.current_round}
      />
    </div>
  );
}
