import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { FeatureShowcaseCarousel } from "@/components/home/FeatureShowcaseCarousel";
import { RotatingSavingsTerm } from "@/components/home/RotatingSavingsTerm";
import {
  ShieldCheck,
  Eye,
  ArrowRight,
  Zap,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-sky-500/20 bg-[#071322]/90 backdrop-blur-xl py-2 sm:py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <KadasheLogo withLink href={isLoggedIn ? "/dashboard" : "/"} size="md" variant="dark-bg" />

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-4">
            <Link href="/how-it-works" className="font-bold text-xs text-sky-200 hover:text-white transition-colors px-2 py-1">
              How It Works
            </Link>

            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white text-xs font-black shadow-lg shadow-sky-500/30 rounded-full px-5 flex items-center gap-1.5">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 text-white" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-xs text-sky-100 hover:text-white hover:bg-sky-500/20">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white text-xs font-black shadow-lg shadow-sky-500/30 rounded-full px-5">
                    Get Started
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-white" />
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex sm:hidden items-center">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-8 px-4 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white text-xs font-black shadow-md shadow-sky-500/30 rounded-full flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-3 w-3" />
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3 text-white" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1">
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="h-8 px-4 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white text-xs font-black shadow-md shadow-sky-500/30 rounded-full flex items-center gap-1"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3 w-3 text-white" />
                  </Button>
                </Link>
                <Link
                  href="/login"
                  className="text-[11px] font-extrabold text-sky-200 hover:text-white px-3 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/50 shadow-[0_0_12px_rgba(2,132,199,0.45)] tracking-tight transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative pt-8 pb-14 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-[1.25] text-white">
            <div className="inline-flex items-center justify-center">
              <span className="text-white shrink-0">Smart</span>
              <div className="w-[170px] sm:w-[310px] lg:w-[360px] text-left shrink-0 overflow-visible">
                <RotatingSavingsTerm />
              </div>
            </div>
            <span className="block mt-2 sm:mt-3 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200 bg-clip-text text-transparent">
              Zero Stories. 100% Safe.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg text-sky-100/90 max-w-2xl mx-auto leading-relaxed font-medium px-2 sm:px-0">
            Contribute together in trusted circles, track every kobo on the live glass ledger, and collect your payout with automated locked escrow protection.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto">
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-7 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-sm shadow-xl shadow-sky-500/40 rounded-full flex items-center justify-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-7 bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-sm shadow-xl shadow-sky-500/40 rounded-full">
                  Start or Join a Circle
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </Button>
              </Link>
            )}

            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-7 font-black text-sm rounded-full bg-[#071322]/90 hover:bg-[#0B1D33] text-white border border-sky-400/50 shadow-lg backdrop-blur-md transition-all"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Sign In Helper below Hero CTA */}
          {isLoggedIn ? (
            <p className="mt-3 text-xs text-sky-200/90 font-medium">
              Signed in as <span className="font-extrabold text-white">{user.email}</span> •{" "}
              <Link href="/dashboard" className="font-extrabold text-sky-300 underline underline-offset-4 hover:text-white transition-colors">
                Open Dashboard
              </Link>
            </p>
          ) : (
            <p className="mt-3 text-xs text-sky-200/90 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="font-extrabold text-white underline underline-offset-4 hover:text-sky-300 transition-colors">
                Sign In here
              </Link>
            </p>
          )}

          {/* Quick Trust Badges */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-extrabold text-sky-200">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/70 border border-sky-400/30 shadow-sm backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0284C7]" />
              Guaranteed Escrow
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/70 border border-sky-400/30 shadow-sm backdrop-blur-md">
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0284C7]" />
              Live Payout Transparency
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/70 border border-sky-400/30 shadow-sm backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0284C7]" />
              Available Offline
            </div>
          </div>

          {/* Feature Showcase Carousel */}
          <div id="how-it-works" className="scroll-mt-24 mt-14 w-full">
            <FeatureShowcaseCarousel />
          </div>
        </section>

        {/* The 3 Core Pillars */}
        <section className="py-24 sm:py-28 bg-sky-950/40 backdrop-blur-2xl border-t border-sky-500/20 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Engineered for Authentic Financial Growth & Security
              </h2>
              <p className="text-sm sm:text-base text-sky-200 font-semibold max-w-xl mx-auto">
                Eliminating default risks, admin mismanagement, and lack of transparency forever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1: Zero Admin Fraud */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-sky-400/30 bg-sky-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#0F2744] via-[#0284C7] to-sky-300 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20 shrink-0">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Zero Admin Fraud</h3>
                <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
                  Your money stays in a protected automated vault until rotation payout. Group organizers never have direct custody of peer funds.
                </p>
              </div>

              {/* Card 2: Real-Time Glass Ledger */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-sky-400/30 bg-sky-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#0F2744] via-[#0284C7] to-sky-300 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20 shrink-0">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Real-Time Glass Ledger</h3>
                <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
                  Instant proof of every contribution and payout. Know who has paid, who is next, and when your rotation arrives in real time.
                </p>
              </div>

              {/* Card 3: AI Reputation Scoring */}
              <div className="glass-vault rounded-[2.5rem] p-8 hover:scale-[1.03] transition-all duration-300 border border-sky-400/30 bg-sky-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#0F2744] via-[#0284C7] to-sky-300 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20 shrink-0">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">AI Reputation Engine</h3>
                <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
                  Every on-time payment increases your trust rating score (+5 pts) and unlocks early collection turns in future savings circles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-500/20 bg-[#071322] py-8 px-4 text-center text-xs text-sky-200/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <KadasheLogo size="sm" variant="dark-bg" />
            <span className="font-extrabold text-white">
              — Automated Rotating Savings Protocol
            </span>
          </div>
          <p>© 2026 Kadashe Nigeria. 3MTT Capstone Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
