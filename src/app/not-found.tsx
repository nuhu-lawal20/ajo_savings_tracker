import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { Home, Compass, ShieldAlert, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Subtle Glow Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 text-center relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <KadasheLogo size="lg" withLink />
        </div>

        {/* 404 Hero Card */}
        <Card className="border border-border/70 shadow-xl shadow-black/5 bg-card/90 backdrop-blur-md rounded-3xl overflow-hidden p-6 sm:p-8 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-sky-500/10 text-[#0284C7] dark:text-sky-400 border border-sky-500/20">
              Error 404 • Page Not Found
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Looks like this path doesn't exist
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The savings circle, invite code, or dashboard page you are looking for may have moved, completed, or been entered with a typo.
            </p>
          </div>

          {/* Quick Invite Code Form */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-left">
            <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-[#0284C7]" />
              Have a Circle Invite Code?
            </p>
            <form action="/join" method="GET" className="flex items-center gap-2">
              <input
                type="text"
                name="code"
                placeholder="e.g. KADASHE-F93346"
                required
                className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0284C7] w-full"
              />
              <Button type="submit" size="sm" className="h-9 px-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shrink-0 cursor-pointer">
                Join
              </Button>
            </form>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-10 rounded-full bg-[#0F2744] hover:bg-[#0A1C33] text-white font-bold text-xs cursor-pointer shadow-sm">
                <Home className="mr-1.5 h-3.5 w-3.5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/circles" className="w-full">
              <Button variant="outline" className="w-full h-10 rounded-full font-bold text-xs cursor-pointer">
                <Compass className="mr-1.5 h-3.5 w-3.5 text-[#0284C7]" />
                Explore Circles
              </Button>
            </Link>
          </div>
        </Card>

        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
