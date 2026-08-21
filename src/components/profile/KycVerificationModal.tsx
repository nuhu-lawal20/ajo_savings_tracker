"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Camera,
  FileText,
  Sparkles,
  ChevronRight,
  Building2,
  Award,
} from "lucide-react";

interface KycVerificationModalProps {
  currentTier?: number;
  triggerText?: string;
  triggerVariant?: "button" | "badge" | "link" | "full-button";
  className?: string;
}

export function KycVerificationModal({
  currentTier = 0,
  triggerText,
  triggerVariant = "button",
  className = "",
}: KycVerificationModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form States:
  // Step 1: BVN / NIN
  const [idType, setIdType] = useState<"bvn" | "nin">("bvn");
  const [idNumber, setIdNumber] = useState("");

  // Step 2: Gov ID & Biometrics
  const [idDocType, setIdDocType] = useState<"passport" | "drivers_license" | "voters_card" | "national_id">("national_id");
  const [selfieCaptured, setSelfieCaptured] = useState(true);

  // Step 3: CAC Registration
  const [cacNumber, setCacNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<"limited_company" | "enterprise_sole_prop" | "cooperative" | "ngo">("limited_company");

  // Determine what target tier the modal is verifying for
  const targetTier = currentTier === 0 ? 1 : currentTier === 1 ? 2 : 3;

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let payload: any = {};
      if (targetTier === 1) {
        payload = { step: "tier1", idType, idNumber };
      } else if (targetTier === 2) {
        payload = { step: "tier2", idDocType, selfieCaptured: true };
      } else {
        payload = {
          step: "tier3",
          cacNumber: cacNumber || "RC-1928472",
          businessName: businessName || "Kadashe Cooperative Ventures Ltd",
          businessType,
        };
      }

      const res = await fetch("/api/kyc/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccessMessage(data.message || "Verification successful!");
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1800);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred");
    }
  }

  return (
    <>
      {currentTier >= 3 ? (
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/40 text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
          Tier 3 CAC Verified
        </Badge>
      ) : triggerVariant === "full-button" ? (
        <Button
          onClick={() => setIsOpen(true)}
          className={`w-full h-11 bg-white hover:bg-sky-50 text-[#0F2744] font-black text-xs sm:text-sm shadow-md rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] ${className}`}
        >
          {targetTier === 1 ? (
            <ShieldCheck className="h-4 w-4 text-[#0284C7] stroke-[2.5px]" />
          ) : targetTier === 2 ? (
            <Camera className="h-4 w-4 text-emerald-600 stroke-[2.5px]" />
          ) : (
            <Building2 className="h-4 w-4 text-purple-600 stroke-[2.5px]" />
          )}
          <span>
            {triggerText ||
              (targetTier === 1
                ? "Verify BVN / NIN (Unlock Tier 1 - ₦1M Pool)"
                : targetTier === 2
                ? "Verify Gov ID & Biometrics (Unlock Tier 2 - ₦10M Pool)"
                : "Verify CAC Registration (Unlock Tier 3 - Unlimited)")}
          </span>
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      ) : triggerVariant === "badge" ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`cursor-pointer ${className}`}
        >
          {triggerText || (targetTier === 1 ? "Verify BVN" : targetTier === 2 ? "Upgrade to T2" : "Upgrade to T3")}
        </button>
      ) : triggerVariant === "link" ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`text-xs font-bold text-[#0284C7] dark:text-sky-400 hover:text-[#0369A1] flex items-center gap-1 ${className}`}
        >
          <span>{triggerText || `Upgrade to Tier ${targetTier}`}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className={`h-9 px-4 font-black text-xs shadow-xs rounded-full transition-all flex items-center gap-1.5 ${
            targetTier === 3
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : targetTier === 2
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-[#0284C7] hover:bg-[#0369A1] text-white"
          } ${className}`}
        >
          {targetTier === 3 ? (
            <Building2 className="h-3.5 w-3.5 text-white" />
          ) : targetTier === 2 ? (
            <Camera className="h-3.5 w-3.5 text-white" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
          )}
          <span>
            {triggerText ||
              (targetTier === 1
                ? "Verify BVN / NIN (Tier 1)"
                : targetTier === 2
                ? "Verify Biometrics & ID (Tier 2)"
                : "Verify CAC Document (Tier 3)")}
          </span>
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#071322] border border-sky-500/30 p-6 sm:p-8 shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-sky-950/60 border border-sky-500/20 text-muted-foreground hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 text-center">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
                  targetTier === 3
                    ? "bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-purple-500/10"
                    : targetTier === 2
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10"
                    : "bg-sky-500/15 border border-sky-500/30 text-sky-400 shadow-sky-500/10"
                }`}
              >
                {targetTier === 3 ? (
                  <Building2 className="h-6 w-6" />
                ) : targetTier === 2 ? (
                  <Camera className="h-6 w-6" />
                ) : (
                  <ShieldCheck className="h-6 w-6" />
                )}
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {targetTier === 1
                  ? "Tier 1: BVN / NIN Verification"
                  : targetTier === 2
                  ? "Tier 2: Gov ID & Biometrics"
                  : "Tier 3: CAC Business Registration"}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {targetTier === 1
                  ? "Enter your 11-digit BVN or NIN to become Tier 1 Verified and unlock circle creation up to ₦1,000,000 total pool."
                  : targetTier === 2
                  ? "Capture facial biometrics and select your Government ID to unlock savings circles up to ₦10,000,000 total pool."
                  : "Provide your Corporate Affairs Commission (CAC) business registration to unlock UNLIMITED pool amounts (₦10M+ / ₦50M+)."}
              </p>
            </div>

            {/* Sandbox Notice */}
            <div className="p-3 rounded-2xl bg-sky-950/70 border border-sky-400/25 text-[11px] text-sky-200/90 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sky-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>3MTT Capstone Verification Sandbox</span>
              </div>
              <p className="text-[10px] text-sky-200/80">
                {targetTier === 1
                  ? "Simulates real-time 11-digit BVN/NIN identity lookup with NIBSS & Paystack."
                  : targetTier === 2
                  ? "Simulates Smile ID 3D liveness facial check and pulls official biometric portrait."
                  : "Simulates live Corporate Affairs Commission (CAC Nigeria) registry validation."}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              {targetTier === 1 ? (
                /* ── TIER 1: BVN / NIN INPUT ── */
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      Select Verification ID
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-sky-950/80 border border-sky-500/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIdType("bvn");
                          setIdNumber("");
                          setError(null);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                          idType === "bvn"
                            ? "bg-[#0284C7] text-white shadow-md"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        BVN (Bank)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIdType("nin");
                          setIdNumber("");
                          setError(null);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                          idType === "nin"
                            ? "bg-[#0284C7] text-white shadow-md"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        NIN (National)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      Enter 11-digit {idType.toUpperCase()} Number
                    </label>
                    <Input
                      type="text"
                      maxLength={11}
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder={`e.g. ${idType === "bvn" ? "22123456789" : "10987654321"}`}
                      className="h-11 rounded-2xl bg-sky-950/60 border-sky-500/30 text-white font-mono text-sm tracking-widest text-center focus-visible:ring-[#0284C7]"
                    />
                  </div>
                </div>
              ) : targetTier === 2 ? (
                /* ── TIER 2: GOV ID & BIOMETRICS FORM ── */
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      Select Government ID Document
                    </label>
                    <select
                      value={idDocType}
                      onChange={(e) => setIdDocType(e.target.value as any)}
                      className="w-full h-11 px-3.5 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="national_id">National Identity Card (NIMC)</option>
                      <option value="passport">Nigerian International Passport</option>
                      <option value="drivers_license">FRSC Driver&apos;s License</option>
                      <option value="voters_card">INEC Voter&apos;s Card (PVC)</option>
                    </select>
                  </div>

                  {/* 3D Facial Liveness Biometric Capture Simulation Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-emerald-200">3D Facial Liveness Check</p>
                      <p className="text-[10px] text-emerald-300/80">Camera ready • Pulls verified portrait photo</p>
                    </div>
                    <Badge className="ml-auto bg-emerald-500/20 text-emerald-300 border-0 text-[10px] font-bold">
                      Ready
                    </Badge>
                  </div>
                </div>
              ) : (
                /* ── TIER 3: CAC BUSINESS REGISTRATION FORM ── */
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      Registered Business / Organization Name
                    </label>
                    <Input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Kaduna Tech Innovators Cooperative Ltd"
                      className="h-11 rounded-2xl bg-sky-950/60 border-sky-500/30 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      CAC Registration Number (RC / BN Number)
                    </label>
                    <Input
                      type="text"
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. RC-1849204 or BN-3920194"
                      className="h-11 rounded-2xl bg-sky-950/60 border-sky-500/30 text-white font-mono text-xs uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-200">
                      Registration Classification
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value as any)}
                      className="w-full h-11 px-3.5 rounded-2xl bg-sky-950/60 border border-sky-500/30 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="limited_company">Limited Liability Company (LTD)</option>
                      <option value="cooperative">Registered Cooperative Society</option>
                      <option value="enterprise_sole_prop">Business Name / Sole Proprietor</option>
                      <option value="ngo">NGO / Incorporated Trustees</option>
                    </select>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || (targetTier === 1 && idNumber.length !== 11) || !!successMessage}
                className={`w-full h-11 text-white font-black text-xs shadow-lg rounded-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  targetTier === 3
                    ? "bg-gradient-to-r from-[#0F2744] via-purple-700 to-purple-600 hover:from-purple-700 hover:to-purple-500 shadow-purple-900/30"
                    : targetTier === 2
                    ? "bg-gradient-to-r from-[#0F2744] via-emerald-700 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 shadow-emerald-900/30"
                    : "bg-gradient-to-r from-[#0F2744] to-[#0284C7] hover:from-[#0284C7] hover:to-[#38BDF8] shadow-sky-900/30"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>
                      {targetTier === 1
                        ? "Verifying with NIBSS…"
                        : targetTier === 2
                        ? "Validating Biometrics & ID…"
                        : "Validating CAC Registry…"}
                    </span>
                  </>
                ) : (
                  <>
                    {targetTier === 3 ? (
                      <Building2 className="h-4 w-4 text-purple-300" />
                    ) : targetTier === 2 ? (
                      <Camera className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-sky-300" />
                    )}
                    <span>
                      {targetTier === 1
                        ? "Verify & Unlock Tier 1 (₦1M Pool Limit)"
                        : targetTier === 2
                        ? "Verify & Unlock Tier 2 (₦10M Pool Limit)"
                        : "Verify CAC & Unlock Tier 3 (Unlimited)"}
                    </span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
