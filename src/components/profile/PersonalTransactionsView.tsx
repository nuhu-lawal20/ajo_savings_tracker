"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeft,
  Search,
  Filter,
  Wallet,
  Building,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface UnifiedTransaction {
  id: string;
  category: "pool_contribution" | "pool_payout" | "wallet_fund" | "bank_withdraw" | "wallet_contribution";
  title: string;
  subtitle: string;
  amount: number;
  direction: "credit" | "debit";
  status: "settled" | "confirmed" | "pending" | "failed" | "reversed";
  reference: string;
  date: string;
  source: string;
  circleName?: string;
  roundNumber?: number;
}

interface PersonalTransactionsViewProps {
  transactions: UnifiedTransaction[];
  userName: string;
}

export function PersonalTransactionsView({ transactions, userName }: PersonalTransactionsViewProps) {
  const [filter, setFilter] = useState<"all" | "in" | "out" | "pools" | "wallet">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate Aggregates
  const totalMoneyIn = transactions
    .filter((t) => t.direction === "credit" && (t.status === "confirmed" || t.status === "settled"))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalMoneyOut = transactions
    .filter((t) => t.direction === "debit" && (t.status === "confirmed" || t.status === "settled"))
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalMoneyIn - totalMoneyOut;

  // Filter Transactions
  const filtered = transactions.filter((t) => {
    // Filter tab
    if (filter === "in" && t.direction !== "credit") return false;
    if (filter === "out" && t.direction !== "debit") return false;
    if (filter === "pools" && !t.category.startsWith("pool")) return false;
    if (filter === "wallet" && (t.category === "pool_contribution" || t.category === "pool_payout")) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        (t.circleName && t.circleName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
        <Link href="/profile">
          <button className="h-9 w-9 rounded-full bg-[#f4f7fb] dark:bg-sky-950/40 hover:bg-sky-100 flex items-center justify-center text-slate-700 dark:text-sky-300 transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Personal Account Statement
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete historical record of all your wallet funding, circle contributions, rotation payouts, and bank withdrawals.
          </p>
        </div>
      </div>

      {/* ── Financial Summary Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Inflow */}
        <Card className="rounded-3xl border border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
            <span>Total Money In</span>
            <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-2">
            +₦{totalMoneyIn.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Wallet top-ups + Escrow payouts received</p>
        </Card>

        {/* Total Outflow */}
        <Card className="rounded-3xl border border-blue-200/60 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-blue-900 dark:text-sky-300 font-bold">
            <span>Total Money Out</span>
            <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <TrendingDown className="h-3.5 w-3.5 text-blue-700 dark:text-sky-400" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-900 dark:text-sky-300 mt-2">
            −₦{totalMoneyOut.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Pool contributions paid + Bank withdrawals</p>
        </Card>

        {/* Net Flow */}
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Net Financial Flow</span>
            <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0284C7] dark:text-sky-400" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₦{netBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">All settled personal activity</p>
        </Card>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: `All (${transactions.length})` },
            { id: "in", label: "Money In (+)" },
            { id: "out", label: "Money Out (−)" },
            { id: "pools", label: "Pools & Escrow" },
            { id: "wallet", label: "Wallet & Bank" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`h-8 px-3.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                filter === tab.id
                  ? "bg-[#0F2744] text-white border-[#0F2744] shadow-xs"
                  : "bg-white dark:bg-sky-950/30 text-slate-700 dark:text-sky-200 border-[#e1e8f0] dark:border-sky-500/20 hover:border-[#0284C7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference or circle..."
            className="h-9 pl-9 pr-3 rounded-full text-xs bg-white dark:bg-sky-950/30 border-[#e1e8f0] dark:border-sky-500/20"
          />
        </div>
      </div>

      {/* ── Transactions List ── */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <CardTitle className="text-sm font-black text-slate-900 dark:text-white">
            Historical Activity Log ({filtered.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Immutable, timestamped record of every personal debit and credit across your entire account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No transactions match your search or filter criteria.
            </div>
          ) : (
            filtered.map((t) => {
              const isCredit = t.direction === "credit";
              const isConfirmed = t.status === "confirmed" || t.status === "settled";

              return (
                <div
                  key={t.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f4f7fb]/50 dark:hover:bg-sky-950/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="h-5 w-5 stroke-[2.5px]" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 stroke-[2.5px]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                          {t.title}
                        </p>
                        <Badge
                          className={`text-[9px] font-bold rounded-full px-2 py-0 border-0 ${
                            t.category === "wallet_fund"
                              ? "bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300"
                              : t.category === "bank_withdraw"
                              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300"
                              : t.category === "pool_payout"
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                              : "bg-slate-100 dark:bg-sky-950/40 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {t.source}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.subtitle}</p>

                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                        Ref: {t.reference} • {new Date(t.date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3 space-y-1">
                    <p
                      className={`text-xs sm:text-sm font-black ${
                        !isConfirmed
                          ? "text-muted-foreground line-through"
                          : isCredit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {isCredit ? "+" : "−"}₦{t.amount.toLocaleString()}
                    </p>

                    <Badge
                      className={`text-[9px] font-bold uppercase rounded-full px-2 py-0 border-0 ${
                        isConfirmed
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : t.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                          : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {t.status}
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
