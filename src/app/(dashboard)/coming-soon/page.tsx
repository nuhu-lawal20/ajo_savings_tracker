import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Rocket, ShieldCheck, Clock, Bell } from "lucide-react";

interface ComingSoonPageProps {
  searchParams: Promise<{
    feature?: string;
  }>;
}

export default async function ComingSoonPage({ searchParams }: ComingSoonPageProps) {
  const { feature } = await searchParams;

  const featureMap: Record<string, { title: string; desc: string; badge: string }> = {
    safebox: {
      title: "SafeBox™ Locked Savings Vault",
      desc: "Lock funds away for specific financial targets with automated high-yield interest powered by Paystack Escrow.",
      badge: "Target Savings",
    },
    spend_save: {
      title: "Spend & Save Micro-Rotations",
      desc: "Automatically save a percentage of every transaction and pool micro-savings with your trusted circles.",
      badge: "Micro-Fintech",
    },
    cards: {
      title: "Kadashe Virtual & Physical Escrow Cards",
      desc: "Spend directly from your completed rotation payout pool at over 40,000 online merchants nationwide.",
      badge: "Payment Cards",
    },
    bills: {
      title: "Airtime, Data & Utility Bills",
      desc: "Pay electricity, buy airtime with up to 6% cashback directly from your circle payout balance.",
      badge: "Bill Payments",
    },
    qr_scan: {
      title: "QR Code Instant Join & Scanner",
      desc: "Scan a peer's Kadashe QR barcode to instantly join their private Adashe rotation or verify membership credentials.",
      badge: "Instant Scan",
    },
  };

  const current = (feature && featureMap[feature]) || {
    title: "Feature Launching Soon",
    desc: "We are putting the finishing security touches on this feature with Paystack Escrow and CBN compliance.",
    badge: "In Development",
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6 text-center">
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] p-8 sm:p-10 shadow-lg shadow-black/5 space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center mx-auto shadow-sm">
          <Rocket className="h-8 w-8 stroke-[2.2px] animate-bounce" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-sky-100 dark:bg-sky-500/20 text-[#0284C7] dark:text-sky-300 border-0 text-xs font-black uppercase px-3 py-1 rounded-full">
            {current.badge} • Coming in V2
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {current.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {current.desc}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/40 border border-[#e1e8f0] dark:border-sky-500/10 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 font-medium">
          <Clock className="h-4 w-4 text-[#0284C7] dark:text-sky-400 shrink-0" />
          <span>Scheduled for release in next quarterly update.</span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/circles" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-full font-bold text-xs border-[#e1e8f0] dark:border-sky-500/20 text-[#0F2744] dark:text-sky-300">
              Explore Active Circles
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
