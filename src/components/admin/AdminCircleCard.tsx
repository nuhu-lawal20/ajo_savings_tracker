"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, Loader2, ArrowUpRight, Copy, Check } from "lucide-react";

interface AdminCircleCardProps {
  circle: {
    id: string;
    name: string;
    contribution_amount: number;
    frequency: string;
    max_members: number;
    status: string;
    current_round: number;
    invite_code: string;
    created_at: string;
    creator?: {
      full_name: string;
      email: string;
    };
    memberships?: Array<{ id: string }>;
  };
}

export function AdminCircleCard({ circle }: AdminCircleCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const memberCount = circle.memberships?.length || 1;

  async function handleAction(action: "freeze" | "unfreeze") {
    const actionLabel =
      action === "freeze"
        ? "FREEZE this savings circle (pause contributions & disbursements)"
        : "UNFREEZE and restore this savings circle";

    if (!confirm(`Are you sure you want to ${actionLabel}?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/circles/${circle.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to ${action} circle`);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(circle.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isPending = circle.status === "pending";
  const isActive = circle.status === "active";
  const isFrozen = circle.status === "frozen";

  return (
    <div className="p-4 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/25 border border-[#e1e8f0] dark:border-sky-500/15 hover:border-sky-400/40 transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/circles/${circle.id}`}
              className="text-sm font-black text-slate-900 dark:text-white hover:text-[#0284C7] dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
            >
              {circle.name}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </Link>
            <Badge
              className={`text-[9px] font-bold uppercase rounded-full px-2 py-0 border-0 ${
                isActive
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : isFrozen
                  ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                  : isPending
                  ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {isFrozen ? "❄️ Frozen" : isPending ? `Pending (${memberCount}/${circle.max_members})` : circle.status}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Creator: <span className="text-slate-800 dark:text-slate-200 font-semibold">{circle.creator?.full_name ?? "Member"}</span> ({circle.creator?.email ?? ""})
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm font-black text-[#0284C7] dark:text-sky-400">
            ₦{Number(circle.contribution_amount).toLocaleString()}
            <span className="text-[10px] text-muted-foreground font-normal"> / {circle.frequency}</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold">
            {memberCount}/{circle.max_members} members joined
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-2 border-t border-[#e1e8f0]/60 dark:border-sky-500/15 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-sky-950/60 border border-[#e1e8f0] dark:border-sky-500/20 text-[10px] font-mono text-[#0284C7] dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/40 transition-colors shadow-xs"
          title="Click to copy invite code"
        >
          {copied ? <Check className="h-3 w-3 text-[#0284C7]" /> : <Copy className="h-3 w-3" />}
          <span>{circle.invite_code}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link href={`/circles/${circle.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-[11px] font-bold rounded-full border-[#e1e8f0] dark:border-sky-500/30 text-slate-700 dark:text-sky-200 hover:bg-sky-50 dark:hover:bg-sky-500/20"
            >
              View Ledger
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>

          {isPending && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Clock className="h-3 w-3" />
                Auto-starts when full
              </span>
              <Button
                size="sm"
                onClick={() => handleAction("freeze")}
                disabled={loading}
                variant="outline"
                className="h-8 px-2.5 text-[11px] font-bold rounded-full border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 shadow-xs"
                title="Freeze this pending pool"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "❄️ Freeze"}
              </Button>
            </div>
          )}

          {isActive && (
            <Button
              size="sm"
              onClick={() => handleAction("freeze")}
              disabled={loading}
              variant="outline"
              className="h-8 px-3 text-[11px] font-bold rounded-full border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 shadow-xs"
            >
              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "❄️ Freeze Circle"}
            </Button>
          )}

          {isFrozen && (
            <Button
              size="sm"
              onClick={() => handleAction("unfreeze")}
              disabled={loading}
              className="h-8 px-3 text-[11px] font-black rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Unfreeze & Restore"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


