"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PoolMember {
  id: string;
  user_id: string;
  has_paid_current_round: boolean;
  payout_position: number;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    trust_score: number;
  } | null;
}

export interface PoolCircle {
  id: string;
  name: string;
  current_round: number;
  contribution_amount: number;
  max_members: number;
  status: string;
  members: PoolMember[];
  transactions: any[];
}

interface PoolsLiveLedgerProps {
  pools: PoolCircle[];
  currentUserId: string;
  isOperatorView?: boolean;
}

export function PoolsLiveLedger({ pools, currentUserId, isOperatorView = false }: PoolsLiveLedgerProps) {
  const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0]?.id || "all");

  const activePool = pools.find((p) => p.id === selectedPoolId);
  const isAllView = selectedPoolId === "all" || !activePool;

  // Filter transactions based on tab
  const displayedTransactions = isAllView
    ? pools.flatMap((p) => p.transactions).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : activePool?.transactions || [];

  // Aggregated metrics
  const totalPooledEscrow = pools.reduce((acc, p) => {
    const paidCount = p.members.filter((m) => m.has_paid_current_round).length;
    return acc + paidCount * Number(p.contribution_amount);
  }, 0);

  const totalPlatformTarget = pools.reduce(
    (acc, p) => acc + Number(p.contribution_amount) * Number(p.max_members),
    0
  );

  return (
    <div className="space-y-6">
      {/* ── 1. POOL SELECTOR TABS (If user has multiple pools) ── */}
      {pools.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedPoolId("all")}
            className={`h-9 px-4 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border ${
              isAllView
                ? "bg-[#0F2744] text-white border-[#0F2744] shadow-sm"
                : "bg-white dark:bg-sky-950/30 text-slate-700 dark:text-sky-200 border-[#e1e8f0] dark:border-sky-500/20 hover:border-[#0284C7]"
            }`}
          >
            All Pools ({pools.length})
          </button>

          {pools.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPoolId(p.id)}
              className={`h-9 px-4 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                selectedPoolId === p.id
                  ? "bg-[#0284C7] text-white border-[#0284C7] shadow-sm"
                  : "bg-white dark:bg-sky-950/30 text-slate-700 dark:text-sky-200 border-[#e1e8f0] dark:border-sky-500/20 hover:border-[#0284C7]"
              }`}
            >
              <span>{p.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  selectedPoolId === p.id ? "bg-white/20 text-white" : "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7]"
                }`}
              >
                R#{p.current_round}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── 2. ROUND ESCROW STATUS & CONTRIBUTOR BREAKDOWN ── */}
      {pools.length === 0 ? (
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 p-8 text-center">
          <Users className="h-10 w-10 text-sky-400/50 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No active savings circles joined yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Join a savings circle to start contributing and view live pool escrow updates.
          </p>
          <Link href="/circles">
            <button className="h-9 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs">
              Explore Pools →
            </button>
          </Link>
        </Card>
      ) : (
        pools.map((p) => {
          // If specific pool selected and this is not it, skip
          if (!isAllView && p.id !== selectedPoolId) return null;

          const paidMembers = p.members.filter((m) => m.has_paid_current_round);
          const pendingMembers = p.members.filter((m) => !m.has_paid_current_round);
          const currentRoundCollected = paidMembers.length * Number(p.contribution_amount);
          const currentRoundTarget = Number(p.max_members) * Number(p.contribution_amount);
          const progressPercent = Math.min(100, Math.round((currentRoundCollected / (currentRoundTarget || 1)) * 100));

          return (
            <Card
              key={p.id}
              className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                        {p.name}
                      </CardTitle>
                      <Badge className="bg-sky-500/15 text-[#0284C7] dark:text-sky-300 border-sky-400/30 text-[10px] font-black rounded-full px-2.5 py-0.5">
                        Round #{p.current_round} of {p.max_members}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      ₦{Number(p.contribution_amount).toLocaleString()} / member • Target Payout: ₦
                      {currentRoundTarget.toLocaleString()}
                    </CardDescription>
                  </div>

                  <Link href={`/circles/${p.id}`}>
                    <span className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1">
                      View Circle Room <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-5">
                {/* Escrow Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs items-center font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#0284C7]" />
                      Round #{p.current_round} Escrow Vault:
                    </span>
                    <span className="font-black text-[#0284C7] dark:text-sky-400 text-sm">
                      ₦{currentRoundCollected.toLocaleString()}{" "}
                      <span className="text-muted-foreground font-semibold text-xs">
                        / ₦{currentRoundTarget.toLocaleString()} ({paidMembers.length}/{p.max_members} paid)
                      </span>
                    </span>
                  </div>

                  <div className="h-3 w-full bg-[#f4f7fb] dark:bg-sky-950/60 rounded-full overflow-hidden p-0.5 border border-[#e1e8f0] dark:border-sky-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] transition-all duration-700 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* ── TWO-COLUMN CONTRIBUTOR STATUS BREAKDOWN ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Column A: Confirmed Contributors (Paid) */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Paid for Round #{p.current_round}</span>
                      </div>
                      <Badge className="bg-emerald-200/60 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border-0 text-[10px] font-black px-2 py-0">
                        {paidMembers.length} Confirmed
                      </Badge>
                    </div>

                    {paidMembers.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No members have paid yet this round.</p>
                    ) : (
                      <div className="space-y-2">
                        {paidMembers.map((m) => {
                          const isCurrentUser = m.user_id === currentUserId;
                          return (
                            <div
                              key={m.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#071322] border border-emerald-200/40 dark:border-emerald-500/15 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                                  {m.profile?.full_name?.charAt(0) || "M"}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 dark:text-white truncate">
                                    {m.profile?.full_name || "Member"}{" "}
                                    {isCurrentUser && (
                                      <span className="text-[10px] text-[#0284C7] font-black">(You)</span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">Turn #{m.payout_position}</p>
                                </div>
                              </div>
                              <span className="font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                                ₦{Number(p.contribution_amount).toLocaleString()} ✓
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Column B: Yet to Contribute (Pending) */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>Yet to Contribute</span>
                      </div>
                      <Badge className="bg-amber-200/60 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 border-0 text-[10px] font-black px-2 py-0">
                        {pendingMembers.length} Awaiting
                      </Badge>
                    </div>

                    {pendingMembers.length === 0 ? (
                      <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>100% Complete! Round payout is ready.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {pendingMembers.map((m) => {
                          const isCurrentUser = m.user_id === currentUserId;
                          return (
                            <div
                              key={m.id}
                              className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                                isCurrentUser
                                  ? "bg-amber-100/60 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40"
                                  : "bg-white dark:bg-[#071322] border-amber-200/40 dark:border-amber-500/15"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                                  {m.profile?.full_name?.charAt(0) || "M"}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 dark:text-white truncate">
                                    {m.profile?.full_name || "Member"}{" "}
                                    {isCurrentUser && (
                                      <span className="text-[10px] text-amber-600 dark:text-amber-300 font-black">
                                        (You — Due)
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">Turn #{m.payout_position}</p>
                                </div>
                              </div>

                              {isCurrentUser ? (
                                <Link href={`/circles/${p.id}`}>
                                  <button className="h-7 px-3 rounded-full bg-gradient-to-r from-[#0F2744] to-[#0284C7] text-white font-black text-[10px] hover:scale-105 transition-all shadow-sm">
                                    Pay Now
                                  </button>
                                </Link>
                              ) : (
                                <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0 text-[11px]">
                                  ₦{Number(p.contribution_amount).toLocaleString()} Due
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* ── 3. LIVE TRANSACTIONS FEED (All Peer Payments in these Circles) ── */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#0284C7] animate-pulse" />
              Live Pool Glass Ledger ({displayedTransactions.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Every peer contribution and rotation payout timestamped and cryptographically signed.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
          {displayedTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No transactions recorded for this pool yet.
            </div>
          ) : (
            displayedTransactions.map((tx: any) => {
              const isContribution = tx.type === "contribution";
              const isUserTx = tx.user_id === currentUserId;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f4f7fb]/50 dark:hover:bg-sky-950/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isContribution
                          ? "bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400"
                          : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isContribution ? (
                        <ArrowUpRight className="h-5 w-5 stroke-[2.5px]" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5 stroke-[2.5px]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                          {tx.profile?.full_name || tx.user?.full_name || "Pool Member"}{" "}
                          {isUserTx && <span className="text-[#0284C7] font-bold text-[11px]">(You)</span>}
                        </p>
                        <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-[#e1e8f0] dark:border-sky-500/20 text-[9px] font-bold rounded-full px-2 py-0">
                          {tx.circle?.name || "Pool"} • R#{tx.round_number || 1}
                        </Badge>
                        {tx.source === "wallet" && (
                          <Badge className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-[8px] font-bold px-1.5 py-0 rounded">
                            Paid via Wallet
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                        Ref: {tx.paystack_reference || tx.reference} •{" "}
                        {new Date(tx.created_at).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3 space-y-1">
                    <p
                      className={`text-xs sm:text-sm font-black ${
                        isContribution ? "text-slate-900 dark:text-white" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isContribution ? "+" : "−"}₦{Number(tx.amount).toLocaleString()}
                    </p>
                    <Badge
                      className={`text-[9px] font-bold uppercase rounded-full px-2 py-0 border-0 ${
                        tx.status === "confirmed"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
