import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Users,
  Eye,
  Sparkles,
  ArrowRight,
  Zap,
  RefreshCw,
  Lock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-600/30 border border-emerald-400/30">
              ₦
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none bg-gradient-to-r from-emerald-700 to-emerald-950 dark:from-emerald-300 dark:to-white bg-clip-text text-transparent">
                Alajo
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">
                Digital Savings Circle
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs hover:bg-emerald-500/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/30 rounded-xl px-4">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative py-14 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />


          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.12]">
            Replacing Physical Trust with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Programmatic Trust
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
            Alajo digitizes the traditional Nigerian rotating savings (Ajo / Esusu / Adashe) with real-time transparent ledgers, automated Paystack escrow, and AI trust scoring.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 rounded-xl">
                Join a Circle Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm rounded-xl border-emerald-600/30 hover:bg-emerald-500/10">
                View Demo Ledger
              </Button>
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              100% Paystack Escrow
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Real-time Glass Ledger
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Offline-First PWA
            </div>
          </div>

          {/* Glass Classy Naira Savings Card Mockup */}
          <div className="mt-14 w-full max-w-2xl glass-vault rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                  ₦
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Kaduna Tech Innovators Ajo</h3>
                  <p className="text-[11px] text-muted-foreground font-medium">5 Members • Monthly Rotation • Round 1 of 5</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Active Round
              </Badge>
            </div>

            {/* Escrow Pool Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Escrow Pool Balance</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
                  ₦50,000<span className="text-xs text-muted-foreground font-semibold">.00</span>
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Target Met • Ready for Payout
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Current Round Recipient</p>
                <p className="text-lg font-black text-amber-700 dark:text-amber-300 mt-1">
                  Nuhu Lawal <span className="text-xs font-bold text-muted-foreground">(Pos #1)</span>
                </p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">
                  Trust Score: <span className="font-extrabold text-emerald-600">85/100</span> • Priority Slot
                </p>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Glass Ledger Real-time Status</span>
                <span className="text-emerald-600 dark:text-emerald-400">5 of 5 Paid (100%)</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Core Pillars */}
        <section className="py-14 bg-card/60 backdrop-blur-md border-t border-border px-4 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Engineered for Authentic Nigerian Financial Reality
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Eliminating fraud, defaults, and opacity with modern software security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-vault hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-500/20">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg">Zero Admin Fraud</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Funds are secured via automated Paystack escrow. The group organizer never holds, routes, or touches peer funds.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-vault hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-500/20">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg">Real-Time Glass Ledger</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Every contribution and round payout broadcasts live to all members via Supabase Realtime WebSocket channels.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-vault hover:scale-[1.02] transition-transform duration-300">
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-500/20">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg">Offline-First Resiliency</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    View active circles and contribution schedules even during network blackouts via Dexie.js and Workbox service worker caching.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-8 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 Alajo — Programmatic Digital Savings Circle.</p>
          <p className="font-bold text-foreground">
            3MTT Fellow: Nuhu Lawal (FE/23/84783109) • Kaduna State
          </p>
        </div>
      </footer>
    </div>
  );
}

