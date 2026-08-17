import Link from "next/link";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleDollarSign, LayoutDashboard, UserCheck, ShieldCheck } from "lucide-react";

interface NavbarProps {
  userProfile?: {
    full_name: string;
    email: string;
    trust_score: number;
  } | null;
}

export function Navbar({ userProfile }: NavbarProps) {
  const initials = userProfile?.full_name
    ? userProfile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AL";

  const trustScore = userProfile?.trust_score ?? 50;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none">Alajo</span>
              <span className="text-[10px] text-muted-foreground font-medium">Digital Savings</span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600" />
              Dashboard
            </Link>
            <Link
              href="/circles"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <CircleDollarSign className="h-4 w-4" />
              Circles
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              Trust Profile
            </Link>
          </nav>
        </div>

        {/* Right Section: Trust Badge & User Profile */}
        <div className="flex items-center gap-3">
          {/* Trust Score Mini Badge */}
          <Link href="/profile" title="AI Trust Score">
            <Badge
              variant="outline"
              className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer ${
                trustScore >= 70
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : trustScore >= 40
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-500/30"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Trust: {trustScore}</span>
            </Badge>
          </Link>

          {/* User Avatar */}
          <Link href="/profile">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
