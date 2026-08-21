"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/layout/SignOutButton";
import {
  CircleDollarSign,
  LayoutDashboard,
  Receipt,
  UserCheck,
  ShieldCheck,
  Crown,
  Shield,
} from "lucide-react";


interface NavbarProps {
  userProfile?: {
    full_name: string;
    email: string;
    trust_score?: number;
    is_admin?: boolean;
    admin_role?: string;
  } | null;
}

export function Navbar({ userProfile }: NavbarProps) {
  const pathname = usePathname();
  const trustScore = userProfile?.trust_score ?? 50;
  const isSuperAdmin =
    userProfile?.admin_role === "super_admin" ||
    (userProfile?.is_admin && userProfile?.admin_role !== "helper_admin");
  const isHelperAdmin = userProfile?.admin_role === "helper_admin";
  const isAdmin = isSuperAdmin || isHelperAdmin;

  const initials =
    userProfile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";


  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e1e8f0] dark:border-sky-500/20 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand Logo & Left Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center">
            <KadasheLogo size="md" />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#0284C7]" />
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
              href="/transactions"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Receipt className="h-4 w-4" />
              Ledger
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              Trust Profile
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-sm"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Trust Badge, Admin Badge & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Role Badge */}
          {isAdmin && (
            <Link href="/admin" title={isSuperAdmin ? "Super Admin Console" : "Helper Admin Console"}>
              <Badge
                className={
                  isSuperAdmin
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs"
                    : "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs"
                }
              >
                {isSuperAdmin ? (
                  <>
                    <Crown className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                    <span>Super Admin</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 text-[#0284C7] dark:text-sky-400" />
                    <span>Helper Admin</span>
                  </>
                )}
              </Badge>
            </Link>
          )}


          {/* Trust Score Mini Badge */}
          <Link href="/profile" title="AI Trust Score">
            <Badge
              variant="outline"
              className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 cursor-pointer ${
                trustScore >= 70
                  ? "bg-sky-50 dark:bg-sky-950/50 text-[#0284C7] dark:text-sky-300 border-sky-500/30"
                  : trustScore >= 40
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-500/30"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Trust: {trustScore}</span>
            </Badge>
          </Link>

          {/* User Avatar */}
          <Link href="/profile">
            <Avatar className="h-9 w-9 border border-[#e1e8f0] dark:border-sky-500/20">
              <AvatarFallback className="bg-gradient-to-tr from-[#0F2744] to-[#0284C7] text-white text-xs font-bold">
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
