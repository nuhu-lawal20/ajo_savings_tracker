import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletFundModal } from "@/components/wallet/WalletFundModal";
import { WithdrawModal } from "@/components/wallet/WithdrawModal";
import { BankLinkModal } from "@/components/wallet/BankLinkModal";
import {
  Wallet,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "My Wallet — Kadashe",
  description: "Manage your Kadashe wallet balance, fund your account, withdraw to your bank, and pay circle contributions.",
};

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const adminDb = createAdminClient();

  // Profile + bank account info
  const { data: profile } = await adminDb
    .from("profiles")
    .select("full_name, email, kyc_tier, bank_account_number, bank_account_name, bank_code, bank_verified_at")
    .eq("id", user.id)
    .single();

  // Wallet balance from derived view
  const { data: balanceRow } = await adminDb
    .from("wallet_balances")
    .select("available_balance, total_credited, total_debited")
    .eq("user_id", user.id)
    .single();

  const walletBalance = Number(balanceRow?.available_balance ?? 0);
  const totalCredited = Number(balanceRow?.total_credited ?? 0);
  const totalDebited = Number(balanceRow?.total_debited ?? 0);

  // Recent wallet ledger entries
  const { data: ledgerHistory } = await adminDb
    .from("wallet_ledger")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const hasBankLinked = !!profile?.bank_account_number;
  const isKycVerified = (profile?.kyc_tier ?? 0) >= 1;

  const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    fund: { label: "Wallet Top-Up", icon: ArrowDownLeft, color: "text-emerald-500" },
    credit_payout: { label: "Circle Payout", icon: ArrowDownLeft, color: "text-sky-500" },
    debit_contribution: { label: "Circle Contribution", icon: ArrowUpRight, color: "text-amber-500" },
    withdraw: { label: "Bank Withdrawal", icon: ArrowUpRight, color: "text-rose-500" },
    refund: { label: "Refund", icon: ArrowDownLeft, color: "text-emerald-500" },
    fee: { label: "Platform Fee", icon: ArrowUpRight, color: "text-slate-400" },
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e1e8f0] dark:border-sky-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Wallet
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Ledger-backed wallet — fund, withdraw, or pay circle contributions instantly.
          </p>
        </div>
        <Link href="/dashboard">
          <span className="text-xs font-semibold text-muted-foreground hover:text-sky-600 flex items-center gap-1">
            ← Back to Dashboard
          </span>
        </Link>
      </div>

      {/* ── KYC GATE ── */}
      {!isKycVerified && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/40 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Identity Verification Required</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Complete Tier 1 KYC (BVN/NIN) to fund your wallet or link a bank account.{" "}
              <Link href="/profile" className="underline font-semibold">Verify now →</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── DUAL BALANCE HERO ── */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0F2744] via-[#035388] to-[#071526] text-white p-6 shadow-xl overflow-hidden border border-sky-500/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">

          {/* Wallet Balance — Primary */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-200 font-semibold">
              <Wallet className="h-3.5 w-3.5" />
              <span>Available Wallet Balance</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black tracking-tight">
              ₦{walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-sky-100/70">
              All funds backed 1:1 by Paystack Float Account · Zero fractional reserve
            </p>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sky-500/30">
            <div className="text-xs">
              <p className="text-sky-300 font-semibold mb-0.5">Total Received</p>
              <p className="font-black text-white text-lg">₦{totalCredited.toLocaleString()}</p>
            </div>
            <div className="text-xs">
              <p className="text-sky-300 font-semibold mb-0.5">Total Spent</p>
              <p className="font-black text-white text-lg">₦{totalDebited.toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {isKycVerified ? (
              <WalletFundModal />
            ) : (
              <button disabled className="h-9 px-4 rounded-full bg-white/20 text-white/50 text-xs font-bold cursor-not-allowed flex items-center gap-1.5">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                Fund Wallet
              </button>
            )}

            {hasBankLinked && walletBalance > 0 ? (
              <WithdrawModal
                availableBalance={walletBalance}
                bankAccountName={profile?.bank_account_name ?? ""}
                bankAccountNumber={profile?.bank_account_number ?? ""}
              />
            ) : (
              <button disabled className="h-9 px-4 rounded-full bg-white/10 text-white/40 text-xs font-bold cursor-not-allowed flex items-center gap-1.5 border border-white/20">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── LINKED BANK ACCOUNT CARD ── */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-sky-500/10 flex items-center justify-center text-[#0284C7]">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Linked Bank Account</CardTitle>
                <CardDescription className="text-xs">For withdrawals — must match your verified name</CardDescription>
              </div>
            </div>
            {hasBankLinked ? (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-0 text-[10px] font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-0 text-[10px] font-bold rounded-full">
                Not Linked
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasBankLinked ? (
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#f4f7fb] dark:bg-sky-950/30 border border-[#e1e8f0] dark:border-sky-500/20">
                <p className="text-sm font-black text-slate-900 dark:text-white">{profile?.bank_account_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  •••• •••• {profile?.bank_account_number?.slice(-4)}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                <ShieldCheck className="inline h-3 w-3 mr-1 text-emerald-500" />
                Name-verified via Paystack Enquiry. 30-day cooldown applies after any withdrawal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Link your Nigerian bank account to enable withdrawals. Your account name must match your KYC identity.
              </p>
              {isKycVerified ? (
                <BankLinkModal />
              ) : (
                <p className="text-xs text-amber-600 font-semibold">Complete KYC verification first.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── WALLET LEDGER HISTORY ── */}
      <Card className="rounded-3xl border border-[#e1e8f0] dark:border-sky-500/20">
        <CardHeader className="pb-3 border-b border-[#e1e8f0]/60 dark:border-sky-500/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-sky-500/10 flex items-center justify-center text-[#0284C7]">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Wallet Ledger</CardTitle>
                <CardDescription className="text-xs">Every credit and debit — immutable and transparent</CardDescription>
              </div>
            </div>

            <Link href="/profile/transactions">
              <span className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
                Full Statement →
              </span>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-[#e1e8f0]/60 dark:divide-sky-500/15">
          {!ledgerHistory || ledgerHistory.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Wallet className="h-10 w-10 text-sky-300/50 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No transactions yet</p>
              <p className="text-xs text-muted-foreground">Fund your wallet to get started.</p>
            </div>
          ) : (
            ledgerHistory.map((entry: any) => {
              const cfg = typeConfig[entry.type] ?? { label: entry.type, icon: CreditCard, color: "text-slate-400" };
              const Icon = cfg.icon;
              const isCredit = entry.direction === "credit";
              const isPending = entry.status === "pending";
              const isFailed = entry.status === "failed" || entry.status === "reversed";

              return (
                <div key={entry.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f4f7fb]/60 dark:hover:bg-sky-950/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-100 dark:bg-emerald-500/15" : "bg-rose-100 dark:bg-rose-500/15"}`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{cfg.label}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{entry.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3 space-y-0.5">
                    <p className={`text-sm font-black ${isFailed ? "text-slate-400 line-through" : isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                      {isCredit ? "+" : "−"}₦{Number(entry.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {isPending && <Clock className="h-3 w-3 text-amber-500" />}
                      {isFailed && <AlertTriangle className="h-3 w-3 text-rose-400" />}
                      <span className={`text-[10px] font-semibold capitalize ${isPending ? "text-amber-500" : isFailed ? "text-rose-400" : "text-muted-foreground"}`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* ── SECURITY NOTICE ── */}
      <div className="rounded-2xl border border-[#e1e8f0] dark:border-sky-500/20 bg-[#f4f7fb] dark:bg-sky-950/20 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-[#0284C7] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-900 dark:text-white">Kadashe Zero-Custody Guarantee</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Wallet balances are 100% backed by a Paystack Float Account. Your money is never mixed with operating expenses. All transactions are cryptographically referenced and auditable via the Live Glass Ledger.{" "}
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Demo mode: Paystack test keys active — no real naira moves.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
