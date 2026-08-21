import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Wallet,
  Receipt,
} from "lucide-react";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch recent transactions as notifications
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, circle:circles(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch profile for KYC status notification
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const kycTier = profile?.kyc_tier ?? 1;
  const isAdmin = profile?.is_admin === true;

  // Build unified notification items
  const notifications = [
    ...(!isAdmin && kycTier < 2
      ? [
          {
            id: "kyc-prompt",
            type: "security",
            title: "Verify Your Identity (Unlock Tier 1)",
            desc: "Verify your BVN or NIN to become Tier 1 Verified, start creating circles, join savings pools, and earn +20 Trust points.",
            time: "Action Required",
            icon: ShieldCheck,
            href: "/profile",
            actionText: "Verify Now",
            isUnread: true,
          },
        ]
      : []),

    ...(transactions && transactions.length > 0
      ? transactions.map((t: any) => ({
          id: t.id,
          type: t.type,
          title:
            t.type === "contribution"
              ? `Contribution Confirmed: ${t.circle?.name || "Ajo Circle"}`
              : `Payout Dispatched: ${t.circle?.name || "Ajo Circle"}`,
          desc:
            t.type === "contribution"
              ? `Your payment of ₦${Number(t.amount).toLocaleString()} for Round #${t.round_number} is locked securely in escrow.`
              : `₦${Number(t.amount).toLocaleString()} rotation pool was disbursed directly to your account.`,
          time: new Date(t.created_at).toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          icon: t.type === "contribution" ? Receipt : Wallet,
          href: "/transactions",
          actionText: "View Receipt",
          isUnread: false,
        }))
      : isAdmin
      ? [
          {
            id: "admin-escrow",
            type: "security",
            title: "Zero-Custody Escrow Vault Active",
            desc: "Automated Paystack escrow holds ₦75,000 for Round #1 of Kaduna Tech & Market Adashe.",
            time: "System Live",
            icon: ShieldCheck,
            href: "/admin",
            actionText: "Governance Console",
            isUnread: false,
          },
          {
            id: "admin-ai-trust",
            type: "trust",
            title: "AI Reputation Engine Calibrated",
            desc: "10 citizen profiles and 2 moderator accounts active with continuous trust-scoring telemetry.",
            time: "System Live",
            icon: Award,
            href: "/admin",
            actionText: "Audit Dossiers",
            isUnread: false,
          },
        ]
      : [
          {
            id: "welcome",
            type: "trust",
            title: "Welcome to Kadashe!",
            desc: "Start or join your first savings circle to build your verified AI Trust Score.",
            time: "Just now",
            icon: Award,
            href: "/circles",
            actionText: "Explore Circles",
            isUnread: true,
          },
        ]),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-muted-foreground hover:text-slate-900 dark:hover:text-white lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Notifications & Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time updates on contributions, payout disbursements, and security status.
          </p>
        </div>

        <Link href={isAdmin ? "/admin" : "/dashboard"}>
          <Button variant="outline" size="sm" className="rounded-full text-xs font-bold border-[#e1e8f0] dark:border-sky-500/20 text-[#0F2744] dark:text-sky-300">
            {isAdmin ? "Admin Console" : "Back to Dashboard"}
          </Button>
        </Link>
      </div>


      {/* Notifications List */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15 overflow-hidden">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                n.isUnread
                  ? "bg-sky-50/50 dark:bg-sky-950/30"
                  : "hover:bg-[#f4f7fb]/50 dark:hover:bg-sky-950/20"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === "security"
                      ? "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : n.type === "trust"
                      ? "bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400"
                      : "bg-blue-50 dark:bg-blue-500/15 text-[#0F2744] dark:text-sky-400"
                  }`}
                >
                  <Icon className="h-5 w-5 stroke-[2.2px]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    {n.isUnread && (
                      <span className="h-2 w-2 rounded-full bg-[#0284C7] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                    {n.desc}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-1">
                <Link href={n.href}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 rounded-full text-xs font-bold border-[#e1e8f0] dark:border-sky-500/20 hover:bg-sky-50 dark:hover:bg-sky-500/10 text-[#0284C7] dark:text-sky-300 flex items-center gap-1"
                  >
                    <span>{n.actionText}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
