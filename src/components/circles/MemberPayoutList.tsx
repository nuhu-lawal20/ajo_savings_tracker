"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  X,
  TrendingUp,
  User,
  Sparkles,
  Calendar,
} from "lucide-react";

interface Member {
  id: string;
  user_id: string;
  payout_position: number;
  has_paid_current_round: boolean;
  payout_status: string;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    trust_score: number;
    kyc_tier: number;
    created_at?: string;
  };
}

interface MemberPayoutListProps {
  members: Member[];
  currentUserId?: string;
  creatorId?: string;
  contributionAmount: number;
  currentRound: number;
}

export function MemberPayoutList({
  members,
  currentUserId,
  creatorId,
  contributionAmount,
  currentRound,
}: MemberPayoutListProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <>
      <div className="space-y-2.5">
        {members.map((m) => {
          const isCurrentUser = m.user_id === currentUserId;
          const isOrganizer = m.user_id === creatorId;
          const trustScore = m.profile?.trust_score ?? 50;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] hover:border-sky-400/50 hover:shadow-md ${
                isCurrentUser
                  ? "bg-sky-50/80 dark:bg-sky-950/40 border-sky-500/40 shadow-xs"
                  : "bg-white dark:bg-sky-950/20 border-[#e1e8f0] dark:border-sky-500/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F2744] to-[#0284C7] text-white font-black text-xs shadow-xs shrink-0">
                  #{m.payout_position}
                </div>

                <Avatar className="h-9 w-9 border border-[#e1e8f0] dark:border-sky-500/20">
                  <AvatarFallback className="text-xs font-black bg-sky-100 dark:bg-sky-950 text-[#0F2744] dark:text-sky-300">
                    {m.profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {m.profile?.full_name}
                    </span>
                    {isCurrentUser && (
                      <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-[9px] font-bold px-1.5 py-0">
                        You
                      </Badge>
                    )}
                    {isOrganizer && (
                      <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-0 text-[9px] font-bold px-1.5 py-0">
                        Organizer
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    AI Trust: <span className="font-bold text-slate-800 dark:text-slate-200">{trustScore}/100</span>
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2 sm:gap-3">
                <Badge
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border-0 ${
                    m.has_paid_current_round
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {m.has_paid_current_round ? "Round Paid" : "Payment Pending"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Trust Dossier Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#071322] border border-[#e1e8f0] dark:border-sky-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-sky-950/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pr-8">
              <Avatar className="h-12 w-12 border-2 border-[#0284C7]/40 shadow-sm">
                <AvatarFallback className="text-sm font-black bg-gradient-to-br from-[#0F2744] to-[#0284C7] text-white">
                  {selectedMember.profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black tracking-tight">
                    {selectedMember.profile?.full_name}
                  </h3>
                  {selectedMember.user_id === creatorId && (
                    <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-0 text-[9px] font-bold px-1.5 py-0">
                      Organizer
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{selectedMember.profile?.email}</p>
              </div>
            </div>

            {/* AI Trust Reputation Score Meter */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-sky-200 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#0284C7] dark:text-sky-400" />
                  AI Trust Score
                </span>
                <span className="text-sm font-black text-[#0284C7] dark:text-sky-400">
                  {selectedMember.profile?.trust_score ?? 50} / 100
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 dark:bg-sky-950/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] rounded-full transition-all duration-500"
                  style={{ width: `${selectedMember.profile?.trust_score ?? 50}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {(selectedMember.profile?.trust_score ?? 50) >= 80
                  ? "⭐ Elite Tier Saver • High Reliability Record"
                  : "✓ Verified Community Contributor"}
              </p>
            </div>

            {/* Payout Position Rationale */}
            <div className="p-4 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 border border-[#e1e8f0] dark:border-sky-500/15 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Rotation Payout Slot:</span>
                <Badge className="bg-[#0284C7] text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                  Turn #{selectedMember.payout_position}
                </Badge>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-sky-500/10 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-[11px]">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Algorithmic Queue Allocation
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Assigned <strong>Turn #{selectedMember.payout_position}</strong> based on mathematical AI Trust Ranking ({selectedMember.profile?.trust_score ?? 50} pts).{" "}
                  {selectedMember.user_id === creatorId
                    ? "Anti-Organizer Favoritism Rule Active: If the circle creator shares the exact same trust score as another member, the creator is automatically placed BELOW that member to eliminate conflict of interest."
                    : "Circle creators do not receive priority payouts — queue position is 100% earned by reputation."}
                </p>
              </div>
            </div>


            {/* Round 1 Payment Status */}
            <div className="p-3.5 rounded-2xl border border-[#e1e8f0] dark:border-sky-500/15 flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Round #{currentRound} Contribution:</span>
              <div className="flex items-center gap-1.5">
                {selectedMember.has_paid_current_round ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₦{contributionAmount.toLocaleString()} Confirmed in Escrow
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ₦{contributionAmount.toLocaleString()} Pending
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setSelectedMember(null)}
              className="w-full h-11 rounded-full bg-[#0F2744] hover:bg-[#0284C7] text-white font-black text-xs transition-all"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
