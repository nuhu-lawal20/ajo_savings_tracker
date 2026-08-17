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
import { ActivateCircleButton } from "@/components/circles/ActivateCircleButton";
import { PaymentButton } from "@/components/payments/PaymentButton";
import { GlassLedger } from "@/components/circles/GlassLedger";

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id: circleId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch circle details with creator
  const { data: circle, error: circleError } = await supabase
    .from("circles")
    .select("*, creator:profiles!circles_creator_id_fkey(*)")
    .eq("id", circleId)
    .single();

  if (circleError || !circle) {
    notFound();
  }

  // Fetch members with profiles
  const { data: members } = await supabase
    .from("memberships")
    .select("*, profile:profiles(*)")
    .eq("circle_id", circleId)
    .order("payout_position", { ascending: true });

  // Fetch transactions for glass ledger
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, profile:profiles(full_name)")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false });

  const isCreator = circle.creator_id === user!.id;
  const currentMembersCount = members?.length ?? 0;
  const poolPerRound = Number(circle.contribution_amount) * circle.max_members;
  const userMembership = members?.find((m: any) => m.user_id === user!.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link href="/circles">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{circle.name}</h1>
              <Badge
                className={`text-xs ${
                  circle.status === "active"
                    ? "bg-emerald-600 text-white"
                    : circle.status === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {circle.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organized by {circle.creator?.full_name} • Invite Code:{" "}
              <span className="font-mono font-bold text-foreground">{circle.invite_code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <InviteShareModal inviteCode={circle.invite_code} circleName={circle.name} />

          {isCreator && circle.status === "pending" && (
            <ActivateCircleButton circleId={circle.id} memberCount={currentMembersCount} />
          )}

          {circle.status === "active" && userMembership && !userMembership.has_paid_current_round && (
            <PaymentButton
              circleId={circle.id}
              amount={Number(circle.contribution_amount)}
              email={user!.email!}
              circleName={circle.name}
            />
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Round Pool Payout
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₦{poolPerRound.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              ₦{Number(circle.contribution_amount).toLocaleString()} × {circle.max_members} members
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Rotation Cycle
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold capitalize">{circle.frequency}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Round {circle.current_round} of {circle.max_members}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Members Joined
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">
              {currentMembersCount} / {circle.max_members}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {circle.max_members - currentMembersCount} open slots remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Escrow Protection
            </CardTitle>
            <Lock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">100% Locked</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Zero Admin Direct Custody
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member Payout Schedule Order */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Rotation Payout Order</h2>
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6 space-y-3">
            {members?.map((m: any) => {
              const isCurrentUser = m.user_id === user!.id;
              const trustScore = m.profile?.trust_score ?? 50;

              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    isCurrentUser
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30"
                      : "bg-muted/30 border-border/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold text-sm shadow-sm">
                      #{m.payout_position}
                    </div>

                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="text-xs font-bold">
                        {m.profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{m.profile?.full_name}</span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        AI Trust: <span className="font-semibold text-foreground">{trustScore}/100</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <Badge
                      variant={m.has_paid_current_round ? "default" : "outline"}
                      className={`text-xs ${
                        m.has_paid_current_round ? "bg-emerald-600 text-white" : "text-muted-foreground"
                      }`}
                    >
                      {m.has_paid_current_round ? "Round Paid" : "Payment Pending"}
                    </Badge>
                  </div>
                </div>
              );
            })}
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
