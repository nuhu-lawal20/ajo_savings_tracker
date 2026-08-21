"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Plus, ChevronRight, Eye, EyeOff, Store, Wallet, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BalanceCardProps {
  walletBalance?: number;
  lockedInAdashe: number;
  activeCirclesCount: number;
  totalPooledCapital: number;
  targetCircleName?: string;
  payoutPosition?: number;
}

export function BalanceCard({
  walletBalance = 0,
  lockedInAdashe,
  activeCirclesCount,
  totalPooledCapital,
  targetCircleName,
  payoutPosition,
}: BalanceCardProps) {
  const [isMasked, setIsMasked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kadashe_hide_balance");
      if (saved === "true") {
        setIsMasked(true);
      }
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  function toggleMask() {
    const newState = !isMasked;
    setIsMasked(newState);
    try {
      localStorage.setItem("kadashe_hide_balance", String(newState));
    } catch {
      // Ignore storage restrictions
    }
  }

  const formattedWallet =
    walletBalance > 0 ? `₦${walletBalance.toLocaleString()}` : "₦0.00";
  const formattedLocked =
    lockedInAdashe > 0 ? `₦${lockedInAdashe.toLocaleString()}` : "₦0.00";

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#0F2744] via-[#035388] to-[#071526] text-white p-5 sm:p-6 shadow-xl shadow-sky-950/20 overflow-hidden border border-sky-500/20">
      {/* Ambient watermark glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#0284C7]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row: Escrow Badge & Global Privacy Toggle */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-sky-500/20 text-sky-200 border-sky-400/30 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-sky-300" />
              <span>Zero-Custody Escrow</span>
            </Badge>

            <button
              type="button"
              onClick={toggleMask}
              title={isMasked ? "Show balances" : "Hide balances"}
              className="p-1.5 -m-1 rounded-full text-sky-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
            >
              {isMasked ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Show</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Hide</span>
                </>
              )}
            </button>
          </div>

          <Link
            href="/transactions"
            className="flex items-center gap-0.5 text-xs text-sky-100 hover:text-white font-semibold transition-colors group"
          >
            <span>Ledger & History</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Dual-Pillar Financial Grid (Wallet vs Locked in Adashe) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Pillar 1: Ready Wallet Balance */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold">
                <Wallet className="h-3.5 w-3.5 text-sky-300" />
                <span>Wallet Balance</span>
              </div>
              <span className="text-[10px] text-sky-300/80 font-medium">Ready Cash</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight select-none text-white">
                {isMasked ? "••••••••" : formattedWallet}
              </span>
            </div>

            <p className="text-[10px] text-sky-100/70 font-medium">
              Available for instant withdrawal or circle funding.
            </p>
          </div>

          {/* Pillar 2 (Hero): Locked in Adashe Pools */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/25 to-[#0F2744]/80 backdrop-blur-md border border-sky-400/40 space-y-2 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5 text-sky-300" />
                <span>Locked in Adashe</span>
              </div>
              <Badge className="bg-sky-400/30 text-white border-0 text-[9px] font-black px-2 py-0">
                {activeCirclesCount} {activeCirclesCount === 1 ? "Active Pool" : "Active Pools"}
              </Badge>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight select-none text-white">
                {isMasked ? "••••••••" : formattedLocked}
              </span>
            </div>

            <p className="text-[10px] text-sky-100/90 font-medium truncate">
              {totalPooledCapital > 0
                ? `Targeting ₦${totalPooledCapital.toLocaleString()} rotation payout pool`
                : "Join a circle to begin rotating savings"}
            </p>
          </div>
        </div>

        {/* Bottom Sub-strip: Quick Circle Creation & Pool Summary */}
        <div className="pt-2 border-t border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-100/90">
          <div className="flex items-center gap-2 min-w-0">
            <Store className="h-4 w-4 text-sky-300 shrink-0" />
            <span className="truncate">
              {targetCircleName ? (
                <>
                  <strong className="text-white">{targetCircleName}</strong>
                  {payoutPosition ? ` • Turn #${payoutPosition}` : ""}
                </>
              ) : (
                <>Active Rotations: <strong className="text-white">{activeCirclesCount} circles</strong></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/circles/create">
              <button className="h-8 px-3.5 rounded-full bg-white hover:bg-sky-50 text-[#0F2744] font-black text-xs shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer">
                <Plus className="h-3.5 w-3.5 text-[#0F2744] stroke-[3px]" />
                <span>Create Circle</span>
              </button>
            </Link>

            <Link href="/circles">
              <button className="h-8 px-3.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-white font-bold text-xs border border-sky-400/30 transition-all cursor-pointer">
                Explore Pools
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
