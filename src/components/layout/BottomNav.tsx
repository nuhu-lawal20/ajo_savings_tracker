"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users2,
  ReceiptText,
  ShieldAlert,
  User,
  Crown,
  Compass,
  Wallet,
} from "lucide-react";

interface BottomNavProps {
  isAdmin?: boolean;
}

export function BottomNav({ isAdmin }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = isAdmin
    ? [
        {
          name: "Console",
          href: "/admin",
          icon: Crown,
          isActive: pathname === "/admin",
        },
        {
          name: "Pools",
          href: "/circles",
          icon: Users2,
          isActive: pathname.startsWith("/circles"),
        },
        {
          name: "Ledger",
          href: "/transactions",
          icon: ReceiptText,
          isActive: pathname === "/transactions",
        },
        {
          name: "Profile",
          href: "/profile",
          icon: User,
          isActive: pathname === "/profile",
        },
      ]
    : [
        {
          name: "Home",
          href: "/dashboard",
          icon: Home,
          isActive: pathname === "/dashboard",
        },
        {
          name: "Circles",
          href: "/circles",
          icon: Users2,
          isActive: pathname.startsWith("/circles"),
        },
        {
          name: "Finance",
          href: "/transactions",
          icon: ReceiptText,
          isActive: pathname === "/transactions",
        },
        {
          name: "Wallet",
          href: "/wallet",
          icon: Wallet,
          isActive: pathname === "/wallet",
        },
        {
          name: "Me",
          href: "/profile",
          icon: User,
          isActive: pathname === "/profile",
        },
      ];


  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#071322]/95 backdrop-blur-lg border-t border-[#e1e8f0] dark:border-sky-500/20 px-2 py-2 safe-area-pb shadow-lg shadow-black/5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 ${
                item.isActive
                  ? "text-[#0F2744] dark:text-sky-300 font-bold scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  item.isActive
                    ? "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-300"
                    : "text-current"
                }`}
              >
                <Icon className="h-5 w-5 stroke-[2.2px]" />
              </div>
              <span className="text-[10px] font-semibold mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
