"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Users,
  Eye,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Wallet,
  Clock,
} from "lucide-react";

interface ShowcaseSlide {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  amount: string;
  subAmount: string;
  statusBadge: string;
  statusBadgeColor: string;
  highlightLabel: string;
  highlightValue: string;
  highlightSub: string;
  progressLabel: string;
  progressPercent: number;
  progressDetail: string;
  icon: any;
}

const slides: ShowcaseSlide[] = [
  {
    id: 1,
    tag: "Step 1: Start or Join",
    tagColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    title: "Market Traders & Peers Ajo",
    subtitle: "5 Members • Weekly Contribution • ₦20,000 each",
    amountLabel: "Weekly Target Pool",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Active Rotation",
    statusBadgeColor: "bg-emerald-600 text-white",
    highlightLabel: "How You Join",
    highlightValue: "Instant Invite Link",
    highlightSub: "Choose or get assigned your payout slot based on trust",
    progressLabel: "Circle Capacity",
    progressPercent: 100,
    progressDetail: "5 of 5 Members Joined",
    icon: Users,
  },
  {
    id: 2,
    tag: "Step 2: Safe Vault Escrow",
    tagColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    title: "100% Protected Savings Pool",
    subtitle: "No organizer or admin has custody of your money",
    amountLabel: "Secured Escrow Balance",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Vault Locked",
    statusBadgeColor: "bg-amber-600 text-white",
    highlightLabel: "Admin Access Level",
    highlightValue: "₦0.00 (Zero Custody)",
    highlightSub: "Funds are programmatically locked until rotation payout",
    progressLabel: "Security Status",
    progressPercent: 100,
    progressDetail: "Protected against hit-and-run defaults",
    icon: Lock,
  },
  {
    id: 3,
    tag: "Step 3: Live Glass Ledger",
    tagColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    title: "Real-Time Transparent Tracking",
    subtitle: "Every member sees live updates the second a contribution is made",
    amountLabel: "Collected This Round",
    amount: "₦80,000",
    subAmount: " / ₦100,000",
    statusBadge: "Live Updating",
    statusBadgeColor: "bg-emerald-600 text-white animate-pulse",
    highlightLabel: "Current Turn Recipient",
    highlightValue: "Amina Bello (Slot #2)",
    highlightSub: "Next in line for automated circle disbursement",
    progressLabel: "Round Contributions",
    progressPercent: 80,
    progressDetail: "4 of 5 Members Paid • 1 Pending",
    icon: Eye,
  },
  {
    id: 4,
    tag: "Step 4: Prompt Payout & Credit",
    tagColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    title: "Automated Round Disbursement",
    subtitle: "Full pool delivered to the rightful member on rotation day",
    amountLabel: "Total Payout Disbursed",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Round Completed",
    statusBadgeColor: "bg-emerald-600 text-white",
    highlightLabel: "Member Reputation Earned",
    highlightValue: "+15 Trust Points",
    highlightSub: "Paying on time unlocks priority #1 slots in future circles",
    progressLabel: "Cycle Progression",
    progressPercent: 100,
    progressDetail: "Round 2 of 5 Completed Successfully",
    icon: Wallet,
  },
];

export function FeatureShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[currentIndex];
  const IconComponent = slide.icon;

  return (
    <div
      className="w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === currentIndex
                ? "w-8 bg-emerald-600 dark:bg-emerald-400"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Glass Vault Showcase Card */}
      <div className="glass-vault rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden transition-all duration-500 border border-emerald-500/20 shadow-2xl">
        {/* Subtle Ambient Currency Glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-emerald-500/20 via-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-emerald-400/30 shrink-0">
              ₦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                  {slide.title}
                </h3>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {slide.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${slide.tagColor}`}
            >
              {slide.tag}
            </Badge>
            <Badge className={`${slide.statusBadgeColor} text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm`}>
              {slide.statusBadge}
            </Badge>
          </div>
        </div>

        {/* Center Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
          {/* Target / Balance Box */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                {slide.amountLabel}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
                {slide.amount}
                <span className="text-xs text-muted-foreground font-semibold">{slide.subAmount}</span>
              </p>
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Real-time Automated Escrow
            </p>
          </div>

          {/* Key Feature Highlight Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                {slide.highlightLabel}
              </p>
              <p className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">
                {slide.highlightValue}
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium mt-1 leading-snug">
              {slide.highlightSub}
            </p>
          </div>
        </div>

        {/* Live Progress Bar Section */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <IconComponent className="h-3.5 w-3.5 text-emerald-600" />
              {slide.progressLabel}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {slide.progressDetail}
            </span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/40"
              style={{ width: `${slide.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
