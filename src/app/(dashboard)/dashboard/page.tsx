import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  Plus,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Fetch user's circles & memberships
  const { data: memberships } = await supabase
    .from("memberships")
    .select("*, circle:circles(*)")
    .eq("user_id", user!.id);

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, circle:circles(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const trustScore = profile?.trust_score ?? 50;
  const activeCirclesCount = memberships?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{profile?.full_name ?? "Member"}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your savings circles, rotation positions, and transparent payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/circles/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25">
              <Plus className="mr-1.5 h-4 w-4" />
              Create Circle
            </Button>
          </Link>
          <Link href="/circles">
            <Button variant="outline">
              <Users className="mr-1.5 h-4 w-4" />
              Browse Circles
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trust Score Card */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Trust Score
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold flex items-baseline gap-2">
              <span>{trustScore}</span>
              <span className="text-xs text-muted-foreground font-normal">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {trustScore >= 70 ? "Tier 1: Priority Payouts" : "Tier 2: Standard Rotation"}
            </p>
          </CardContent>
        </Card>

        {/* Active Circles */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Circles
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">{activeCirclesCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {activeCirclesCount === 0 ? "Join your first circle" : "Circles in rotation"}
            </p>
          </CardContent>
        </Card>

        {/* Total Pooled Escrow */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Escrow Security
            </CardTitle>
            <Lock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Protected by Paystack Escrow
            </p>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              KYC Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold">Tier {profile?.kyc_tier ?? 1}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Verified with Email OTP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Circles & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Circles Section (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Your Savings Circles</h2>
            <Link href="/circles" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View all
            </Link>
          </div>

          {activeCirclesCount === 0 ? (
            <Card className="border-dashed border-2 border-border/70 p-8 text-center bg-card/50">
              <div className="max-w-sm mx-auto flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CircleDollarSign className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base">No active circles yet</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start your own trusted savings circle with friends or enter an invite code to join an existing group.
                </p>
                <div className="pt-2 flex gap-3">
                  <Link href="/circles/create">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Create Circle
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memberships?.map((m: any) => (
                <Card key={m.id} className="border-border/60 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                        {m.circle?.frequency}
                      </Badge>
                      <Badge
                        variant={m.has_paid_current_round ? "default" : "destructive"}
                        className="text-[10px]"
                      >
                        {m.has_paid_current_round ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold mt-2">{m.circle?.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Position: <span className="font-bold text-foreground">#{m.payout_position}</span> of {m.circle?.max_members}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Contribution</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{Number(m.circle?.contribution_amount).toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/circles/${m.circle_id}`}>
                      <Button size="sm" variant="ghost" className="text-xs font-semibold">
                        Ledger
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Section (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
            <span className="text-xs text-muted-foreground">Glass Ledger</span>
          </div>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 space-y-3">
              {(!transactions || transactions.length === 0) ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No transaction records found yet.
                </div>
              ) : (
                transactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                  >
                    <div>
                      <p className="text-xs font-semibold">{tx.circle?.name ?? "Savings Circle"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">
                        ₦{Number(tx.amount).toLocaleString()}
                      </p>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
