import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureShowcaseCarousel } from "@/components/home/FeatureShowcaseCarousel";
import {
  ShieldCheck,
  Users,
  Eye,
  ArrowRight,
  Zap,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-400/30">
              ₦
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-white">
                Alajo
              </span>
              <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase mt-0.5">
                Digital Savings Circle
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link href="/how-it-works" className="font-bold text-xs text-emerald-200 hover:text-white transition-colors hidden sm:block px-2 py-1">
              How It Works
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-bold text-xs text-emerald-100 hover:text-white hover:bg-emerald-500/20">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 rounded-full px-5">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-slate-950" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative py-14 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.12] text-white">
            Save in Circles With Peace of Mind.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Zero Stories. 100% Safe.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-emerald-100/90 max-w-2xl leading-relaxed font-medium">
            Join or create trusted Ajo & Esusu groups with your friends, traders, and colleagues. Track every kobo on a live transparent ledger and collect your payout on time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto items-center justify-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/40 rounded-full">
                Get Started — Start or Join a Circle
                <ArrowRight className="ml-2 h-4 w-4 text-slate-950" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm rounded-full border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/20 hover:text-white">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Sign In Directly Below Get Started */}
          <p className="mt-3.5 text-xs text-emerald-200/80 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-white underline underline-offset-4 hover:text-emerald-300 transition-colors">
              Sign In here
            </Link>
          </p>

          {/* Quick Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-extrabold text-emerald-200">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 shadow-sm backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Guaranteed Escrow Protection
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 shadow-sm backdrop-blur-md">
              <Eye className="h-4 w-4 text-emerald-400" />
              Live Payout Transparency
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 shadow-sm backdrop-blur-md">
              <Zap className="h-4 w-4 text-emerald-400" />
              Always Available Offline
            </div>
          </div>

          {/* Dynamic Auto-Swiping Circular Stylish Feature Showcase Carousel */}
          <div id="how-it-works" className="scroll-mt-24 mt-14 w-full">
            <FeatureShowcaseCarousel />
          </div>
        </section>

        {/* The 3 Core Pillars */}
        <section className="py-24 sm:py-28 bg-emerald-950/50 backdrop-blur-2xl border-t border-emerald-500/20 px-4 sm:px-8 relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Engineered for Authentic Financial Growth & Security
              </h2>
              <p className="text-sm sm:text-base text-emerald-200 font-semibold max-w-xl mx-auto">
                Eliminating default risks, admin mismanagement, and lack of transparency forever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1: Zero Admin Fraud */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-emerald-400/30 bg-emerald-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 shrink-0">
                  <ShieldCheck className="h-8 w-8 text-slate-950" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Zero Admin Fraud</h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
                  Your money stays in a protected automated vault until rotation payout. Group organizers never have direct custody of peer funds.
                </p>
              </div>

              {/* Card 2: Real-Time Glass Ledger */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-emerald-400/30 bg-emerald-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 shrink-0">
                  <Eye className="h-8 w-8 text-slate-950" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Real-Time Glass Ledger</h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
                  Instant proof of every contribution and payout. Know who has paid, who is next, and when your rotation arrives in real time.
                </p>
              </div>

              {/* Card 3: Offline-First Resiliency */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-emerald-400/30 bg-emerald-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 shrink-0">
                  <RefreshCw className="h-8 w-8 text-slate-950" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Offline-First Resiliency</h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
                  Access your circles, check schedules, and review payment history anytime — even without an active internet connection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20 py-8 px-4 sm:px-8 text-center text-xs text-emerald-300/80 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 Alajo — Programmatic Digital Savings Circle.</p>
          <p className="font-bold text-white">
            3MTT Fellow: Nuhu Lawal (FE/23/84783109) • Kaduna State
          </p>
        </div>
      </footer>
    </div>
  );
}


