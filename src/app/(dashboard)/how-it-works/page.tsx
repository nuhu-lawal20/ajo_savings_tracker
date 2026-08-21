import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Users2,
  KeyRound,
  Lock,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Link2,
  Receipt,
  Scale,
  Wallet,
  Building2,
  Fingerprint,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  QrCode,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* ── 1. HERO HEADER ── */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[#0284C7] dark:text-sky-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Complete Member & Security Guide
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          How Kadashe Works
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Traditional Nigerian rotating savings (<strong>Adashe / Ajo / Esusu</strong>) re-engineered with
          zero-custody locked escrow, algorithmic AI reputation scoring, and tamper-proof glass ledgers.
        </p>
      </div>

      {/* ── 2. CRITICAL ADVICE & SECURITY WARNING: JOINING BY INVITE CODE ── */}
      <Card className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-[#071322] dark:to-amber-950/20 shadow-md overflow-hidden">
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Essential Security Advice & Peer Warning</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-0 text-[10px] font-black">
            Anti-Impersonation Protocol
          </Badge>
        </div>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Always Join Group Circles via Unique Invite Code or Direct Link
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Because multiple informal groups may create circles with similar or identical names (e.g. <em>&quot;Kaduna Tech Savers&quot;</em> or <em>&quot;Almara Market Group&quot;</em>), <strong>never search and join a pool based on name alone</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-sky-950/30 border border-emerald-500/30 space-y-1.5">
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ✅ Recommended: Use 6-Char Invite Code
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your group organizer has an immutable 6-character code (e.g. <span className="font-mono font-bold text-slate-900 dark:text-white">KADASHE-F93346</span>). Entering this code guarantees you join your verified private cohort.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-sky-950/30 border border-emerald-500/30 space-y-1.5">
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-emerald-600" />
                ✅ Recommended: One-Click Join Link
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When an organizer shares their WhatsApp / SMS invite link, opening it automatically inputs the cryptographic code and opens your exact circle room.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Have an invite code from your Adashe circle organizer?
            </p>
            <form action="/join" method="GET" className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                name="code"
                placeholder="e.g. KADASHE-F93346"
                required
                className="h-9 px-3.5 rounded-full border border-amber-500/30 bg-white dark:bg-sky-950/60 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-slate-900 dark:text-white w-full sm:w-48"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 px-4 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Join Pool →
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. THE 4-STEP CORE LIFECYCLE ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Users2 className="h-5 w-5 text-[#0284C7]" />
          The 4-Step Adashe Lifecycle
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-xl bg-blue-500/15 text-[#0284C7] dark:text-sky-400 text-xs font-black flex items-center justify-center">
                01
              </span>
              <Badge className="bg-sky-100 text-[#0284C7] dark:bg-sky-500/20 dark:text-sky-300 border-0 text-[10px] font-black">
                Identity & KYC
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Verify Identity & Unlock Pool Capacity
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Before joining or creating circles, complete your KYC tier. Tier 1 (BVN/NIN) unlocks up to ₦1M total pool, Tier 2 (Biometrics) unlocks up to ₦10M, and Tier 3 (CAC) is Unlimited.
              </p>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black flex items-center justify-center">
                02
              </span>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-0 text-[10px] font-black">
                Invite Code
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Create Pool or Join with Invite Code
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Set contribution amount (₦5,000 to ₦10,000,000+), frequency (Weekly / Monthly), and member target. Share your unique 6-character Invite Code with trusted family, traders, or colleagues.
              </p>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center justify-center">
                03
              </span>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-0 text-[10px] font-black">
                Zero-Custody Escrow
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Automated Locked Contributions
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Contribute seamlessly using your <strong>Kadashe Wallet balance</strong> (0 fees) or direct Paystack checkout (Card, USSD, NIP Bank Transfer). Funds lock into an automated escrow vault.
              </p>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center">
                04
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-0 text-[10px] font-black">
                Instant Payout
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Rotational Lump-Sum Payout
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                When all members complete their round contribution, the escrow automatically disburses the full lump-sum payout directly into the scheduled recipient&apos;s Kadashe Wallet ready for instant bank withdrawal.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 4. KYC TIERS & MAX CONTRIBUTION LIMITS ── */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#e1e8f0]/60 dark:border-sky-500/15 pb-4">
          <CardTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0284C7]" />
            KYC Verification Tiers & Pool Capacity Rules
          </CardTitle>
          <CardDescription className="text-xs">
            To ensure complete solvency and zero default risk, circle total pool payout amounts (Contribution × Members) are strictly enforced by KYC standing.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
          {/* Tier 0 */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">Tier 0: Unverified Account</p>
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 text-[9px] font-bold border-0">
                    View Only
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sign up email and password. Allows exploring the dashboard and viewing public info.</p>
              </div>
            </div>
            <span className="text-xs font-black text-slate-500 shrink-0">₦0 Pool Access</span>
          </div>

          {/* Tier 1 */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3 bg-sky-50/40 dark:bg-sky-950/20">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Fingerprint className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">Tier 1: BVN / NIN Verified</p>
                  <Badge className="bg-sky-500/20 text-[#0284C7] dark:text-sky-300 text-[9px] font-black border-0">
                    +15 Trust pts
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Instant validation against official Nigerian banking databases via NIBSS/Paystack.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-[#0284C7] dark:text-sky-400">Up to ₦1,000,000</span>
              <p className="text-[10px] text-muted-foreground">Total pool payout</p>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">Tier 2: Government ID & 3D Biometrics</p>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[9px] font-black border-0">
                    +30 Trust pts
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Valid Passport, National ID, Voter&apos;s Card, or Driver&apos;s License with live facial liveness check.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Up to ₦10,000,000</span>
              <p className="text-[10px] text-muted-foreground">Total pool payout</p>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-4 sm:p-5 flex items-start justify-between gap-3 bg-purple-50/40 dark:bg-purple-950/20">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 dark:text-white">Tier 3: CAC Business Registration</p>
                  <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[9px] font-black border-0">
                    +40 Trust pts
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Corporate Affairs Commission certificate for cooperatives, registered businesses, and institutional pools.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400">UNLIMITED</span>
              <p className="text-[10px] text-muted-foreground">High-volume pools</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 5. ALGORITHMIC REPUTATION & ANTI-FAVORITISM RULE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-2.5">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-[#0284C7] dark:text-sky-400 flex items-center justify-center">
            <Scale className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Anti-Organizer Favoritism Rule
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In traditional Adashe, the organizer often unfairly assigns themselves Turn #1. On Kadashe, <strong>all rotation slots are mathematically computed by AI Trust Score</strong>. If an organizer ties in score with a member, the system automatically gives the non-organizer member the earlier slot.
          </p>
        </Card>

        <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20 bg-white dark:bg-[#071322] shadow-sm p-5 space-y-2.5">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Receipt className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Transparent Glass Ledger
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every contribution debit, escrow lock, and rotational payout generates a cryptographic receipt that broadcasts live in the Circle Room. Every member can see exactly who has contributed and who is due in real-time.
          </p>
        </Card>
      </div>

      {/* ── 6. BOTTOM CTA BAR ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0F2744] via-[#0284C7] to-[#0A1C33] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-black">Ready to Start or Join a Circle?</h3>
          <p className="text-xs text-sky-200/90">Experience automated escrow and zero-dispute rotating savings today.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/circles/create">
            <Button className="rounded-full bg-white hover:bg-sky-50 text-[#0F2744] font-black text-xs h-10 px-5 shadow-sm cursor-pointer">
              + Create Circle
            </Button>
          </Link>
          <Link href="/circles">
            <Button variant="outline" className="rounded-full border-sky-400 text-white hover:bg-sky-500/20 font-black text-xs h-10 px-5 cursor-pointer">
              Join with Code
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
