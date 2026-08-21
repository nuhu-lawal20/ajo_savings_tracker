"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Headphones, Bell, QrCode, Crown, ShieldCheck, Shield } from "lucide-react";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { SignOutButton } from "@/components/layout/SignOutButton";

interface MobileTopBarProps {
  userProfile?: {
    full_name: string;
    email: string;
    kyc_tier?: number;
    trust_score?: number;
    is_admin?: boolean;
    admin_role?: string;
  } | null;
}

export function MobileTopBar({ userProfile }: MobileTopBarProps) {
  const firstName = userProfile?.full_name?.split(" ")[0]?.toUpperCase() || "MEMBER";
  const kycTier = userProfile?.kyc_tier ?? 1;
  const isSuperAdmin =
    userProfile?.admin_role === "super_admin" ||
    (userProfile?.is_admin && userProfile?.admin_role !== "helper_admin");
  const isHelperAdmin = userProfile?.admin_role === "helper_admin";
  const isAdmin = isSuperAdmin || isHelperAdmin;

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-[#071322]/90 backdrop-blur-md border-b border-[#e1e8f0] dark:border-sky-500/20 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: User Avatar & Greeting */}
        <Link href="/profile" className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0F2744] to-[#0284C7] text-white font-black text-xs flex items-center justify-center shadow-xs">
              {firstName.charAt(0)}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-4 px-1 rounded-full text-[8px] font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-xs ${
              isSuperAdmin
                ? "bg-amber-500 text-slate-950"
                : isHelperAdmin
                ? "bg-[#0284C7] text-white"
                : kycTier >= 3
                ? "bg-purple-600 text-white"
                : kycTier === 2
                ? "bg-emerald-500 text-white"
                : kycTier === 1
                ? "bg-sky-500 text-white"
                : "bg-amber-500 text-slate-950"
            }`}>
              {isSuperAdmin ? "SUP" : isHelperAdmin ? "MOD" : kycTier >= 3 ? "T3" : kycTier === 2 ? "T2" : kycTier === 1 ? "T1" : "!"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hi, {firstName}
              </span>
              {isAdmin && (
                <Badge className={`text-[9px] font-black px-1.5 py-0 ${
                  isSuperAdmin
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    : "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/30"
                }`}>
                  {isSuperAdmin ? (
                    <>
                      <Crown className="h-2.5 w-2.5 mr-0.5" />
                      Super
                    </>
                  ) : (
                    <>
                      <Shield className="h-2.5 w-2.5 mr-0.5" />
                      Admin
                    </>
                  )}
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {isSuperAdmin
                ? "Super Admin"
                : isHelperAdmin
                ? "Helper Admin"
                : kycTier >= 3
                ? "Tier 3 CAC"
                : kycTier === 2
                ? "Tier 2 Biometric"
                : kycTier === 1
                ? "Tier 1 Verified"
                : "Unverified"} • {isAdmin ? "100" : (userProfile?.trust_score ?? 50)} pts
            </span>
          </div>
        </Link>


        {/* Right: Quick Utility Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Support (Consumers Only) */}
          {!isAdmin && (
            <Link
              href="/how-it-works"
              className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0284C7] transition-colors"
            >
              <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-0.5 -right-1 bg-pink-500 text-white text-[7px] font-black px-1 py-0.1 rounded-full">
                HELP
              </span>
            </Link>
          )}


          {/* Join / Scan */}
          <Link
            href="/coming-soon?feature=qr_scan"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0284C7] transition-colors"
          >
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>

          {/* Notification Bell */}
          <Link
            href="/notifications"
            className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0284C7] transition-colors"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0284C7]" />
          </Link>

          {/* Sign Out Button for Mobile Header */}
          <SignOutButton
            variant="icon"
            className="p-1.5 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
