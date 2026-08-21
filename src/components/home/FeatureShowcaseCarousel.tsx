"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Eye, Wallet, CheckCircle2 } from "lucide-react";

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
    tagColor: "bg-sky-500/25 text-sky-200 border-sky-400/40",
    title: "Market Traders & Peers Ajo",
    subtitle: "5 Members • Weekly Contribution • ₦20,000 each",
    amountLabel: "Weekly Target Pool",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Active Rotation",
    statusBadgeColor: "bg-[#0284C7] text-white",
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
    tag: "Step 2: Safe Vault",
    tagColor: "bg-amber-500/25 text-amber-200 border-amber-400/40",
    title: "100% Protected Savings Pool",
    subtitle: "No organizer or admin has direct custody of your money",
    amountLabel: "Secured Escrow Balance",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Vault Locked",
    statusBadgeColor: "bg-amber-500 text-slate-950",
    highlightLabel: "Admin Access Level",
    highlightValue: "₦0.00 (Zero Custody)",
    highlightSub: "Funds are programmatically locked until rotation payout",
    progressLabel: "Security Status",
    progressPercent: 100,
    progressDetail: "Protected against defaults",
    icon: Lock,
  },
  {
    id: 3,
    tag: "Step 3: Live Ledger",
    tagColor: "bg-sky-500/25 text-sky-200 border-sky-400/40",
    title: "Real-Time Transparent Tracking",
    subtitle: "Every member sees live updates the second a contribution is made",
    amountLabel: "Collected This Round",
    amount: "₦80,000",
    subAmount: " / ₦100,000",
    statusBadge: "Live Updating",
    statusBadgeColor: "bg-sky-400 text-slate-950 animate-pulse",
    highlightLabel: "Current Turn Recipient",
    highlightValue: "Amina Bello (Slot #2)",
    highlightSub: "Next in line for automated circle disbursement",
    progressLabel: "Round Contributions",
    progressPercent: 80,
    progressDetail: "4 of 5 Members Paid",
    icon: Eye,
  },
  {
    id: 4,
    tag: "Step 4: Payout Day",
    tagColor: "bg-sky-500/25 text-sky-200 border-sky-400/40",
    title: "Automated Round Disbursement",
    subtitle: "Full pool delivered to the rightful member on rotation day",
    amountLabel: "Total Payout Disbursed",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Round Completed",
    statusBadgeColor: "bg-sky-400 text-slate-950",
    highlightLabel: "Member Reputation Earned",
    highlightValue: "+15 Trust Points",
    highlightSub: "Paying on time unlocks priority #1 slots in future circles",
    progressLabel: "Cycle Progression",
    progressPercent: 100,
    progressDetail: "Round 2 of 5 Completed",
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
      className="w-full max-w-2xl mx-auto px-1 sm:px-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Navigation Dots */}
      <div className="flex items-center justify-center gap-2.5 mb-4">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              idx === currentIndex
                ? "w-10 bg-sky-400 shadow-md shadow-sky-400/50"
                : "w-2.5 bg-sky-900/60 hover:bg-sky-700/60 border border-sky-500/20"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Circular Stylish Glass Vault Card */}
      <div className="rounded-3xl sm:rounded-[2.75rem] p-5 sm:p-8 text-left relative overflow-hidden transition-all duration-500 bg-[#071322] border border-sky-400/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(2,132,199,0.15)] w-full text-white">
        {/* Ambient Circular Currency Flare */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-bl from-sky-400/25 via-blue-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-600/15 rounded-full blur-xl pointer-events-none" />

        {/* Top Header with Circular Floating Currency Emblem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/30 pb-4">
          <div className="flex items-center gap-3">
            {/* Circular Stylish Emblem */}
            <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-gradient-to-tr from-[#0F2744] via-[#0284C7] to-sky-400 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-xl shadow-sky-500/40 ring-4 ring-sky-500/20 border border-sky-200/40 shrink-0">
              ₦
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-base sm:text-lg text-white tracking-tight leading-snug truncate">
                {slide.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-sky-200/90 font-medium mt-0.5">
                {slide.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
            <Badge
              variant="outline"
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${slide.tagColor}`}
            >
              {slide.tag}
            </Badge>
            <Badge className={`${slide.statusBadgeColor} text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md`}>
              {slide.statusBadge}
            </Badge>
          </div>
        </div>

        {/* Center Metrics Grid - Circular Curved Glass Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
          {/* Target / Balance Curved Box */}
          <div className="p-5 rounded-[1.75rem] bg-sky-950/60 border border-sky-400/25 flex flex-col justify-between shadow-inner backdrop-blur-md">
            <div>
              <p className="text-[11px] text-sky-300 font-extrabold uppercase tracking-wider">
                {slide.amountLabel}
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-1">
                {slide.amount}
                <span className="text-sm text-sky-300/80 font-bold">{slide.subAmount}</span>
              </p>
            </div>
            <p className="text-[11px] text-sky-300 font-bold mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" /> Real-time Automated Escrow
            </p>
          </div>

          {/* Key Feature Highlight Curved Box */}
          <div className="p-5 rounded-[1.75rem] bg-sky-950/60 border border-amber-400/30 flex flex-col justify-between shadow-inner backdrop-blur-md">
            <div>
              <p className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider">
                {slide.highlightLabel}
              </p>
              <p className="text-xl font-black text-amber-300 mt-1">
                {slide.highlightValue}
              </p>
            </div>
            <p className="text-[11px] text-sky-100/90 font-medium mt-2 leading-relaxed">
              {slide.highlightSub}
            </p>
          </div>
        </div>

        {/* Live Progress Bar Section */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-sky-200 flex items-center gap-1.5 font-semibold">
              <IconComponent className="h-4 w-4 text-sky-400" />
              {slide.progressLabel}
            </span>
            <span className="text-sky-300 font-black">
              {slide.progressDetail}
            </span>
          </div>
          <div className="h-3 w-full bg-sky-950/80 rounded-full overflow-hidden p-0.5 border border-sky-500/30">
            <div
              className="h-full bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-sky-300 rounded-full transition-all duration-700 shadow-md shadow-sky-400/50"
              style={{ width: `${slide.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
