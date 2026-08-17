import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Eye, Sparkles, ArrowRight, Zap, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight">Alajo</span>
              <span className="text-[10px] text-muted-foreground -mt-1 font-medium">Digital Savings Circle</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 px-3.5 py-1 text-xs font-semibold rounded-full border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            3MTT NextGen Capstone Project
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]">
            Replacing Physical Trust with <span className="text-emerald-600 dark:text-emerald-400">Programmatic Trust</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Alajo digitizes the traditional Nigerian rotating savings (Ajo/Esusu/Adashe) with real-time transparent ledgers, automated escrow, and AI trust scoring.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/25">
                Join a Circle Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-semibold text-base">
                View Demo Ledger
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Escrow Protected
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-600" />
              Real-time Glass Ledger
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600" />
              Offline-First PWA
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-12 bg-muted/40 border-t border-border px-4 sm:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Zero Admin Fraud</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Funds are secured via automated Paystack escrow. The group organizer never holds or touches peer funds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Real-Time Glass Ledger</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every contribution, status change, and round payout broadcasts instantly to all circle members via Supabase Realtime.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Offline-First Resiliency</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  View your active circles and contribution schedules even with zero internet. Queued changes sync on reconnection.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 sm:px-8 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Alajo Savings Circle. Built for 3MTT NextGen Capstone.</p>
          <p className="font-medium">Fellow: Nuhu Lawal (FE/23/84783109)</p>
        </div>
      </footer>
    </div>
  );
}
