"use client";

import { useState } from "react";
import { Building2, X, AlertCircle, CheckCircle2, Search } from "lucide-react";

// Full list of Nigerian banks with their Paystack bank codes
const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "EcoBank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank (FCMB)", code: "214" },
  { name: "Guaranty Trust Bank (GTBank)", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Kuda Microfinance Bank", code: "090267" },
  { name: "Opay (OPay Digital Services)", code: "100004" },
  { name: "PalmPay", code: "999991" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "SunTrust Bank", code: "100" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa (UBA)", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
];

export function BankLinkModal() {
  const [open, setOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ account_name: string } | null>(null);

  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  async function handleLink() {
    if (!accountNumber || accountNumber.length !== 10) {
      setError("Enter a valid 10-digit NUBAN account number");
      return;
    }
    if (!bankCode) {
      setError("Select your bank");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wallet/bank-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber, bank_code: bankCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Bank linking failed. Please check details.");
        setLoading(false);
        return;
      }

      setSuccess({ account_name: data.account_name });
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 2500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
      >
        <Building2 className="h-3.5 w-3.5" />
        Link Bank Account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#071322] shadow-2xl border border-[#e1e8f0] dark:border-sky-500/20 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#e1e8f0] dark:border-sky-500/20 shrink-0">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Link Bank Account</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Must match your KYC verified name</p>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-sky-950/40 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Bank search */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">Select Bank</p>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search bank name…"
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#e1e8f0] dark:border-sky-500/30 bg-white dark:bg-sky-950/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto rounded-2xl border border-[#e1e8f0] dark:border-sky-500/20 divide-y divide-[#e1e8f0] dark:divide-sky-500/15">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => { setBankCode(bank.code); setBankSearch(bank.name); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        bankCode === bank.code
                          ? "bg-sky-50 dark:bg-sky-500/20 text-[#0284C7]"
                          : "hover:bg-[#f4f7fb] dark:hover:bg-sky-950/20 text-slate-700 dark:text-sky-100"
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account number */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1.5">Account Number (10 digits)</p>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="0123456789"
                  maxLength={10}
                  className="w-full h-12 px-4 rounded-2xl border border-[#e1e8f0] dark:border-sky-500/30 bg-white dark:bg-sky-950/30 text-sm font-black text-slate-900 dark:text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0284C7]/50"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">Account Verified!</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{success.account_name}</p>
                </div>
              )}

              <button
                onClick={handleLink}
                disabled={loading || !accountNumber || !bankCode || !!success}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] text-white font-black text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Verifying with Paystack…" : success ? "✓ Account Linked" : "Verify & Link Account"}
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                Your account name will be verified against your KYC identity via Paystack.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
