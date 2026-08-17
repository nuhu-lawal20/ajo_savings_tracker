"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Users,
  Eye,
  CheckCircle2,
  Lock,
  Wallet,
  Sparkles,
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
    tagColor: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
    title: "Market Traders & Peers Ajo",
    subtitle: "5 Members • Weekly Contribution • ₦20,000 each",
    amountLabel: "Weekly Target Pool",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Active Rotation",
    statusBadgeColor: "bg-emerald-500 text-slate-950",
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
    progressDetail: "Protected against defaults & fraud",
    icon: Lock,
  },
  {
    id: 3,
    tag: "Step 3: Live Glass Ledger",
    tagColor: "bg-teal-500/25 text-teal-200 border-teal-400/40",
    title: "Real-Time Transparent Tracking",
    subtitle: "Every member sees live updates the second a contribution is made",
    amountLabel: "Collected This Round",
    amount: "₦80,000",
    subAmount: " / ₦100,000",
    statusBadge: "Live Updating",
    statusBadgeColor: "bg-emerald-400 text-slate-950 animate-pulse",
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
    tagColor: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
    title: "Automated Round Disbursement",
    subtitle: "Full pool delivered to the rightful member on rotation day",
    amountLabel: "Total Payout Disbursed",
    amount: "₦100,000",
    subAmount: ".00",
    statusBadge: "Round Completed",
    statusBadgeColor: "bg-emerald-400 text-slate-950",
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
      {/* Slide Navigation Dots */}
      <div className="flex items-center justify-center gap-2.5 mb-4">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              idx === currentIndex
                ? "w-10 bg-emerald-400 shadow-md shadow-emerald-400/50"
                : "w-2.5 bg-emerald-900/60 hover:bg-emerald-700/60 border border-emerald-500/20"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Circular Stylish Glass Vault Card */}
      <div className="glass-vault rounded-[2.75rem] p-7 sm:p-9 text-left relative overflow-hidden transition-all duration-500 border border-emerald-400/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(0,229,131,0.12)]">
        {/* Ambient Circular Currency Flare */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-bl from-emerald-400/25 via-teal-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-600/15 rounded-full blur-xl pointer-events-none" />

        {/* Top Header with Circular Floating Currency Emblem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
          <div className="flex items-center gap-3.5">
            {/* Circular Stylish Emblem */}
            <div className="h-13 w-13 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-500/20 border border-emerald-200/40 shrink-0">
              ₦
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-white tracking-tight leading-snug">
                {slide.title}
              </h3>
              <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                {slide.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge
              variant="outline"
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${slide.tagColor}`}
            >
              {slide.tag}
            </Badge>
            <Badge className={`${slide.statusBadgeColor} text-[11px] font-black px-3 py-1 rounded-full shadow-md`}>
              {slide.statusBadge}
            </Badge>
          </div>
        </div>

        {/* Center Metrics Grid - Circular Curved Glass Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
          {/* Target / Balance Curved Box */}
          <div className="p-5 rounded-[1.75rem] bg-emerald-950/60 border border-emerald-400/25 flex flex-col justify-between shadow-inner backdrop-blur-md">
            <div>
              <p className="text-[11px] text-emerald-300 font-extrabold uppercase tracking-wider">
                {slide.amountLabel}
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-1">
                {slide.amount}
                <span className="text-sm text-emerald-300/80 font-bold">{slide.subAmount}</span>
              </p>
            </div>
            <p className="text-[11px] text-emerald-300 font-bold mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Real-time Automated Escrow
            </p>
          </div>

          {/* Key Feature Highlight Curved Box */}
          <div className="p-5 rounded-[1.75rem] bg-emerald-950/60 border border-amber-400/30 flex flex-col justify-between shadow-inner backdrop-blur-md">
            <div>
              <p className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider">
                {slide.highlightLabel}
              </p>
              <p className="text-xl font-black text-amber-300 mt-1">
                {slide.highlightValue}
              </p>
            </div>
            <p className="text-[11px] text-emerald-100/90 font-medium mt-2 leading-relaxed">
              {slide.highlightSub}
            </p>
          </div>
        </div>

        {/* Live Progress Bar Section */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-200 flex items-center gap-1.5 font-semibold">
              <IconComponent className="h-4 w-4 text-emerald-400" />
              {slide.progressLabel}
            </span>
            <span className="text-emerald-300 font-black">
              {slide.progressDetail}
            </span>
          </div>
          <div className="h-3 w-full bg-emerald-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-700 shadow-md shadow-emerald-400/50"
              style={{ width: `${slide.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
