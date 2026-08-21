"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  ChevronRight,
  Clock,
  Wifi,
  Receipt,
  Users,
} from "lucide-react";

interface DesktopLiveLedgerPanelProps {
  userProfile?: {
    full_name: string;
    email: string;
    trust_score?: number;
    kyc_tier?: number;
  } | null;
  transactions?: any[];
  activeCirclesCount?: number;
  totalPooledCapital?: number;
}

export function DesktopLiveLedgerPanel({
  userProfile,
  transactions = [],
  activeCirclesCount = 0,
  totalPooledCapital = 0,
}: DesktopLiveLedgerPanelProps) {
  return (
    <aside className="w-80 xl:w-96 shrink-0 sticky top-6 self-start hidden lg:block">
      {/* Full-Height Dedicated Live Glass Ledger Card */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden flex flex-col">
        {/* Header with Glowing Live Broadcast Pill */}
        <CardHeader className="pb-3.5 border-b border-[#e1e8f0]/60 dark:border-sky-500/15 bg-[#f4f7fb]/70 dark:bg-sky-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Live Glass Ledger™</span>
                </CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground font-semibold">
                  Zero-Knowledge Public Audit Stream
                </CardDescription>
              </div>
            </div>

            <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-ping" />
              <span>Live Broadcast</span>
            </Badge>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-sky-950/40 border border-[#e1e8f0] dark:border-sky-500/20">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#0284C7]" />
                Escrow Status
              </span>
              <p className="text-xs font-black text-[#0284C7] dark:text-sky-400 mt-0.5">
                100% Protected
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-white dark:bg-sky-950/40 border border-[#e1e8f0] dark:border-sky-500/20">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <Users className="h-3 w-3 text-sky-600" />
                Active Circles
              </span>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                {activeCirclesCount} Pools
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Live Streaming Feed Items (Straight Down) */}
        <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15 max-h-[calc(100vh-280px)] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-[#0284C7] dark:text-sky-400 flex items-center justify-center mx-auto">
                <Activity className="h-6 w-6 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Ready for Real-Time Stream
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  When peer contributions or payouts are processed via Paystack Escrow, cryptographic receipts broadcast live here.
                </p>
              </div>
              <Link href="/circles" className="inline-block pt-1">
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-full border-[#e1e8f0] text-[#0F2744]">
                  Explore Active Circles
                </Button>
              </Link>
            </div>
          ) : (
            transactions.map((tx) => {
              const isPayout = tx.type === "payout";
              return (
                <div
                  key={tx.id}
                  className="p-3.5 hover:bg-[#f4f7fb]/70 dark:hover:bg-sky-950/30 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isPayout
                          ? "bg-sky-100 dark:bg-sky-500/20 text-[#0F2744] dark:text-sky-400"
                          : "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400"
                      }`}
                    >
                      {isPayout ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {isPayout ? "Escrow Payout" : "Peer Contribution"}
                        </p>
                        <Badge className="bg-[#f4f7fb] dark:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-[#e1e8f0] dark:border-sky-500/20 text-[9px] px-1.5 py-0 font-bold shrink-0">
                          {tx.circle?.name || "Ajo Pool"}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        Ref: {tx.paystack_reference}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(tx.created_at).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-0.5">
                    <p className={`text-xs font-black ${isPayout ? "text-[#0284C7] dark:text-sky-400" : "text-slate-900 dark:text-white"}`}>
                      ₦{Number(tx.amount).toLocaleString()}
                    </p>
                    <Badge
                      className={`text-[8px] px-1.5 py-0 border-0 ${
                        tx.status === "confirmed"
                          ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 font-bold"
                          : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
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

        {/* Card Footer Link */}
        <div className="p-3 border-t border-[#e1e8f0]/60 dark:border-sky-500/15 bg-[#f4f7fb]/60 dark:bg-sky-950/20 text-center">
          <Link href="/transactions">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs font-bold text-[#0284C7] dark:text-sky-400 hover:text-[#0369A1] hover:bg-sky-50 dark:hover:bg-sky-500/10 flex items-center justify-center gap-1"
            >
              <span>Inspect Full Ledger & Receipts</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </Card>
    </aside>
  );
}
