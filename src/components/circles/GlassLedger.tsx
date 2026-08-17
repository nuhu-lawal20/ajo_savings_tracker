"use client";

import { useCircleRealtime } from "@/hooks/use-circle-realtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Activity, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Sparkles, Wifi, WifiOff } from "lucide-react";

interface GlassLedgerProps {
  circleId: string;
  initialTransactions: any[];
  initialMembers: any[];
  contributionAmount: number;
  maxMembers: number;
  currentRound: number;
}

export function GlassLedger({
  circleId,
  initialTransactions,
  initialMembers,
  contributionAmount,
  maxMembers,
  currentRound,
}: GlassLedgerProps) {
  const { transactions, members, isConnected, newEventRowId } = useCircleRealtime(
    circleId,
    initialTransactions,
    initialMembers
  );

  // Calculate current round collected funds
  const confirmedContributionsThisRound = transactions.filter(
    (tx) => tx.type === "contribution" && tx.status === "confirmed" && tx.round_number === currentRound
  );

  const totalCollected = confirmedContributionsThisRound.reduce(
    (acc, tx) => acc + Number(tx.amount),
    0
  );

  const targetRoundTotal = contributionAmount * maxMembers;
  const progressPercent = Math.min(100, Math.round((totalCollected / (targetRoundTotal || 1)) * 100));
  const paidMembersCount = members.filter((m) => m.has_paid_current_round).length;

  return (
    <div className="space-y-6">
      {/* Live Connection & Progress Header */}
      <Card className="glass-vault border-border/40 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                Round #{currentRound} Escrow Pool Progress
              </CardTitle>
              <CardDescription className="text-xs">
                {paidMembersCount} of {maxMembers} members have completed contributions for this round
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isConnected
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold"
                    : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold"
                }`}
              >
                {isConnected ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Real-time Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-amber-600" />
                    <span>Reconnecting...</span>
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-muted-foreground">Collected in Escrow:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                ₦{totalCollected.toLocaleString()}{" "}
                <span className="text-muted-foreground font-semibold text-xs">/ ₦{targetRoundTotal.toLocaleString()}</span>
              </span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700 rounded-full shadow-sm shadow-emerald-500/30"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Glass Ledger Records */}
      <Card className="glass-vault border-border/40 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Transparent Glass Ledger
          </CardTitle>
          <CardDescription className="text-xs">
            Every peer payment, timestamp, and payout event broadcasts live to all members
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No transactions recorded for this circle yet. Payments will show live in real-time.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {transactions.map((tx) => {
                const isRecent = tx.id === newEventRowId;
                const isContribution = tx.type === "contribution";

                return (
                  <div
                    key={tx.id}
                    className={`p-4 flex items-center justify-between transition-colors duration-1000 ${
                      isRecent
                        ? "bg-emerald-100/70 dark:bg-emerald-950/70"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          isContribution
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {isContribution ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground">
                            {tx.profile?.full_name ?? "Circle Member"}
                          </p>
                          <Badge variant="outline" className="text-[9px] capitalize">
                            {tx.type} • Round #{tx.round_number}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          Receipt: {tx.paystack_reference} • {new Date(tx.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p
                        className={`text-xs font-extrabold ${
                          isContribution ? "text-foreground" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        ₦{Number(tx.amount).toLocaleString()}
                      </p>
                      <Badge
                        className={`text-[9px] px-2 py-0 ${
                          tx.status === "confirmed"
                            ? "bg-emerald-600 text-white"
                            : tx.status === "pending"
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
