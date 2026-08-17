import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  Eye,
  Wallet,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "How It Works — Alajo Digital Savings Circle",
  description: "Step-by-step guide on how Alajo protects your rotating savings, guarantees payouts, and eliminates admin fraud.",
};

const steps = [
  {
    stepNumber: "01",
    title: "Start or Join a Trusted Circle",
    subtitle: "Quick 2-minute setup with your friends, traders, or colleagues",
    description:
      "Choose a contribution amount that fits your group (e.g. ₦10,000 weekly or ₦50,000 monthly) and select the rotation schedule. Share your private invite link with peers to assemble your circle.",
    outcome: "Fixed payout positions and clear rules agreed before the first kobo is paid.",
    icon: Users,
    tag: "Step 1: Setup",
  },
  {
    stepNumber: "02",
    title: "Pay into a 100% Protected Vault",
    subtitle: "No organizer or admin holds your money in their personal account",
    description:
      "When your contribution turn arrives, pay securely with your card or instant bank transfer. Funds are locked immediately in an automated safe vault until the scheduled rotation date.",
    outcome: "Complete elimination of admin fraud and disappearing organizers.",
    icon: Lock,
    tag: "Step 2: Protection",
  },
  {
    stepNumber: "03",
    title: "Track Everything on the Live Glass Ledger",
    subtitle: "Real-time visibility for every single member in the group",
    description:
      "No more arguments or confusing paper notebooks. The moment any member makes a contribution, the live ledger updates instantly so everyone sees who has paid, who is pending, and who is next in line.",
    outcome: "100% transparency — zero guesswork or hidden transactions.",
    icon: Eye,
    tag: "Step 3: Transparency",
  },
  {
    stepNumber: "04",
    title: "Receive Your Full Lump-Sum Payout on Time",
    subtitle: "Automated disbursement directly to your bank account",
    description:
      "When your scheduled turn arrives and the round target is met, the full savings pool is delivered directly to you with zero hidden deductions or delay stories.",
    outcome: "Guaranteed lump-sum capital to expand your business, pay school fees, or hit big goals.",
    icon: Wallet,
    tag: "Step 4: Payout",
  },
  {
    stepNumber: "05",
    title: "Build Your Verified Trust Score",
    subtitle: "Turn consistent savings into a recognized financial reputation",
    description:
      "Paying your contributions on time automatically boosts your personal Trust Score (0 to 100). Higher scores unlock early priority slots (Position #1) in higher-value savings circles.",
    outcome: "A permanent reputation score that qualifies you for bigger savings opportunities.",
    icon: TrendingUp,
    tag: "Step 5: Reputation",
  },
];

const faqs = [
  {
    q: "Can the circle creator run away with our money?",
    a: "Never. Circle creators have ₦0.00 access to group funds. Contributions are held in an automated programmatic vault that only disburses to the scheduled member on rotation day.",
  },
  {
    q: "What happens if a member fails to contribute after taking their payout?",
    a: "Members build verified Trust Scores and must meet eligibility criteria for early payout slots. Defaulters receive automated payment retries and permanent trust score penalties that restrict them from future circles.",
  },
  {
    q: "Can I use Alajo if I have slow or no internet connection?",
    a: "Yes! Alajo is built offline-first. You can view your circle status, payment schedule, and ledger balances at any time even without active mobile data.",
  },
  {
    q: "How do I know when it's my turn to receive payout?",
    a: "Your rotation slot is assigned upfront and clearly displayed on the Live Glass Ledger with the exact scheduled date and countdown.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-400/30">
              ₦
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none text-white">
                Alajo
              </span>
              <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase mt-0.5">
                Digital Savings Circle
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-bold text-xs text-emerald-100 hover:text-white hover:bg-emerald-500/20">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 rounded-full px-5">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-slate-950" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1">
        <section className="relative py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10" />

          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-extrabold px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            ✦ Simple 5-Step Process
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            How Alajo Works for You and Your Savings Group
          </h1>

          <p className="mt-6 text-base sm:text-xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-medium">
            No stories. No runaway organizers. Just safe, automatic rotating savings built for friends, traders, and colleagues across Nigeria.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/40 rounded-full">
                Start Saving Today
                <ArrowRight className="ml-2 h-4 w-4 text-slate-950" />
              </Button>
            </Link>
          </div>
        </section>

        {/* 5 Step Visual Flow */}
        <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.stepNumber}
                className="glass-vault rounded-[2.5rem] p-7 sm:p-10 border border-emerald-400/30 bg-emerald-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    {/* Circular Step Badge */}
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 shrink-0">
                      {s.stepNumber}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {s.title}
                        </h2>
                        <Badge variant="outline" className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border-emerald-400/30 text-emerald-300 bg-emerald-950/60">
                          {s.tag}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-200/90 font-semibold">
                        {s.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed pt-2">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="mt-6 pt-5 border-t border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300 font-bold bg-emerald-900/30 p-3.5 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Guaranteed Outcome: {s.outcome}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* FAQs */}
        <section className="py-20 bg-black/40 backdrop-blur-2xl border-t border-emerald-500/20 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-extrabold px-4 py-1 rounded-full">
                Frequently Asked Questions
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Everything You Need to Know
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass-vault rounded-[2rem] p-6 border border-emerald-400/25 bg-emerald-950/60 backdrop-blur-md space-y-2.5"
                >
                  <h3 className="font-black text-sm sm:text-base text-white flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 sm:px-8 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto glass-vault rounded-[3rem] p-10 sm:p-14 border border-emerald-400/30 bg-gradient-to-b from-emerald-950/80 to-emerald-900/60 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-400/20">
              ₦
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Save With Total Peace of Mind?
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 font-medium max-w-xl mx-auto">
              Join thousands of Nigerians digitizing their rotating savings circles with zero fear of fraud.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/40 rounded-full">
                  Create Your Circle Now
                  <ArrowRight className="ml-2 h-4 w-4 text-slate-950" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold text-sm rounded-full border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/20 hover:text-white">
                  Sign In to Existing Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20 py-8 px-4 sm:px-8 text-center text-xs text-emerald-300/80 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 Alajo — Programmatic Digital Savings Circle.</p>
          <p className="font-bold text-white">
            3MTT Fellow: Nuhu Lawal (FE/23/84783109) • Kaduna State
          </p>
        </div>
      </footer>
    </div>
  );
}
