"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KadasheLogo } from "@/components/ui/kadashe-logo";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users2,
  ReceiptText,
  ShieldCheck,
  User,
  Crown,
  PlusCircle,
  HelpCircle,
  LogOut,
  Sparkles,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  userProfile?: {
    full_name: string;
    email: string;
    kyc_tier?: number;
    trust_score?: number;
    is_admin?: boolean;
    admin_role?: string;
    avatar_url?: string | null;
  } | null;
}

export function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isSuperAdmin =
    userProfile?.admin_role === "super_admin" ||
    (userProfile?.is_admin && userProfile?.admin_role !== "helper_admin");

  const isHelperAdmin = userProfile?.admin_role === "helper_admin";
  const isAdmin = isSuperAdmin || isHelperAdmin;
  const kycTier = userProfile?.kyc_tier ?? 1;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const navLinks = isAdmin
    ? [
        {
          name: isSuperAdmin ? "Super Admin Console" : "Moderator Console",
          href: "/admin",
          icon: isSuperAdmin ? Crown : ShieldCheck,
          isActive: pathname === "/admin",
          badge: isHelperAdmin ? "Helper Admin" : "Super Admin",
        },

        {
          name: "Pools Oversight",
          href: "/circles",
          icon: Users2,
          isActive: pathname.startsWith("/circles"),
        },
        {
          name: "Escrow Ledger",
          href: "/transactions",
          icon: ReceiptText,
          isActive: pathname === "/transactions",
        },
        {
          name: "Trust & Verification",
          href: "/profile",
          icon: ShieldCheck,
          isActive: pathname === "/profile",
        },
      ]
    : [

        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home,
          isActive: pathname === "/dashboard",
        },
        {
          name: "Savings Circles",
          href: "/circles",
          icon: Users2,
          isActive: pathname.startsWith("/circles"),
        },
        {
          name: "Finance & Ledger",
          href: "/transactions",
          icon: ReceiptText,
          isActive: pathname === "/transactions",
        },
        {
          name: "My Wallet",
          href: "/wallet",
          icon: Wallet,
          isActive: pathname === "/wallet",
          badge: "New",
        },
        {
          name: "Trust & Identity",
          href: "/profile",
          icon: ShieldCheck,
          isActive: pathname === "/profile",
        },
        {
          name: "How It Works",
          href: "/how-it-works",
          icon: HelpCircle,
          isActive: pathname === "/how-it-works",
        },
      ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#071322] border-r border-[#e1e8f0] dark:border-sky-500/20 flex-col justify-between z-30 shadow-sm">
      {/* Top Section */}
      <div className="p-6 space-y-6">
        {/* Brand Logo */}
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="block">
          <KadasheLogo size="md" />
        </Link>

        {/* Action Quick CTA */}
        {isAdmin ? (
          <Link href="/admin" className="block">
            <button className="w-full h-11 px-4 rounded-2xl bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#38BDF8] hover:from-[#0A1C33] hover:to-[#0284C7] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-950/20 transition-all hover:scale-[1.02]">
              <Crown className="h-4 w-4 text-white" />
              <span>Admin Governance Hub</span>
            </button>
          </Link>
        ) : (
          <Link href="/circles/create" className="block">
            <button className="w-full h-11 px-4 rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0A1C33] hover:to-[#0369A1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-950/20 transition-all hover:scale-[1.02]">
              <PlusCircle className="h-4 w-4 text-white" />
              <span>Create Savings Circle</span>
            </button>
          </Link>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  link.isActive
                    ? "bg-sky-50 dark:bg-sky-500/15 text-[#0F2744] dark:text-sky-300 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-sky-950/40 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      link.isActive
                        ? "text-[#0284C7] dark:text-sky-400 stroke-[2.2px]"
                        : "text-slate-400 dark:text-slate-400"
                    }`}
                  />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30 text-[9px] font-bold px-1.5 py-0">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="p-4 border-t border-[#e1e8f0] dark:border-sky-500/20 space-y-3 bg-slate-50/50 dark:bg-sky-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[#0F2744] to-[#0284C7] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
              {userProfile?.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {userProfile?.full_name || "Member"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {isHelperAdmin
                  ? "🛡️ Helper Admin"
                  : isSuperAdmin
                  ? "👑 Super Admin"
                  : kycTier >= 3
                  ? "Tier 3 CAC"
                  : kycTier === 2
                  ? "Tier 2 Biometric"
                  : kycTier === 1
                  ? "Tier 1 Verified"
                  : "Unverified"} • {isAdmin ? "100" : (userProfile?.trust_score ?? 50)} pts

              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
