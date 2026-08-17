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
            Save in Circles With Peace of Mind.{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Zero Stories. 100% Safe.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
            Join or create trusted Ajo & Esusu groups with your friends, traders, and colleagues. Track every kobo on a live transparent ledger and collect your payout on time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 rounded-xl">
                Start or Join a Circle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm rounded-xl border-emerald-600/30 hover:bg-emerald-500/10">
                View Live Demo
              </Button>
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Guaranteed Escrow Protection
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Live Payout Transparency
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Always Available Offline
            </div>
          </div>

          {/* Dynamic Auto-Swiping Feature Showcase Carousel */}
          <div className="mt-14 w-full">
            <FeatureShowcaseCarousel />
          </div>
        </section>


        {/* The 3 Core Pillars */}
        <section className="py-14 bg-card/60 backdrop-blur-md border-t border-border px-4 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Engineered for Authentic Financial Growth & Security
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Eliminating default risks, mismanagement, and lack of transparency.
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
                    Your money stays in a protected automated vault until rotation payout. Group organizers never have direct custody of peer funds.
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
                    Instant proof of every contribution and payout. Know who has paid, who is next, and when your rotation arrives in real time.
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
                    Access your circles, check schedules, and review payment history anytime — even without an active internet connection.
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

