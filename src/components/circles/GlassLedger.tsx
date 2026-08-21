"use client";

import { useCircleRealtime } from "@/hooks/use-circle-realtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#0284C7] dark:text-sky-400 animate-pulse" />
                Round #{currentRound} Escrow Pool Progress
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {paidMembersCount} of {maxMembers} members have completed contributions for this round
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className={`text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border-0 ${
                  isConnected
                    ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 font-bold"
                    : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
                }`}
              >
                {isConnected ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-ping" />
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

        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs items-center">
              <span className="font-bold text-slate-700 dark:text-slate-300">Collected in Escrow:</span>
              <span className="font-black text-[#0284C7] dark:text-sky-400 text-sm sm:text-base">
                ₦{totalCollected.toLocaleString()}{" "}
                <span className="text-muted-foreground font-semibold text-xs">/ ₦{targetRoundTotal.toLocaleString()}</span>
              </span>
            </div>
            <div className="h-3 w-full bg-[#f4f7fb] dark:bg-sky-950/60 rounded-full overflow-hidden p-0.5 border border-[#e1e8f0] dark:border-sky-500/20">
              <div
                className="h-full bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] transition-all duration-700 rounded-full shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Glass Ledger Records */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0284C7] dark:text-sky-400" />
            Transparent Glass Ledger
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Every peer payment, timestamp, and payout event broadcasts live to all members
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-medium">
              No transactions recorded for this circle yet. Payments will show live in real-time.
            </div>
          ) : (
            <div className="divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
              {transactions.map((tx) => {
                const isRecent = tx.id === newEventRowId;
                const isContribution = tx.type === "contribution";

                return (
                  <div
                    key={tx.id}
                    className={`p-4 flex items-center justify-between transition-colors duration-1000 ${
                      isRecent
                        ? "bg-sky-50 dark:bg-sky-950/50"
                        : "hover:bg-[#f4f7fb]/60 dark:hover:bg-sky-950/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isContribution
                            ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400"
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
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            {tx.profile?.full_name ?? "Circle Member"}
                          </p>
                          <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-[#e1e8f0] dark:border-sky-500/20 text-[9px] capitalize px-1.5 py-0 font-bold">
                            {tx.type} • Round #{tx.round_number}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          Ref: {tx.paystack_reference} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p
                        className={`text-xs font-black ${
                          isContribution ? "text-slate-900 dark:text-white" : "text-[#0284C7] dark:text-sky-400"
                        }`}
                      >
                        ₦{Number(tx.amount).toLocaleString()}
                      </p>
                      <Badge
                        className={`text-[9px] px-2 py-0 border-0 ${
                          tx.status === "confirmed"
                            ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 font-bold"
                            : tx.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
                            : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-bold"
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
