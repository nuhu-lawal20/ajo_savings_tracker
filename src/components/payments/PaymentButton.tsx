"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";

export function PaymentButton({
  circleId,
  amount,
  email,
  circleName,
}: {
  circleId: string;
  amount: number;
  email: string;
  circleName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);

    try {
      // 1. Create pending transaction on backend to generate secure reference
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleId,
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      const { reference } = data;

      // 2. Open Paystack Inline Popup
      // Dynamically load Paystack inline JS if not already on window
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        alert("Payment gateway configuration error. Please contact support.");
        setLoading(false);
        return;
      }

      // Check if PaystackPop is loaded
      const loadScript = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).PaystackPop) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = "https://js.paystack.co/v1/inline.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load secure payment gateway"));
          document.body.appendChild(script);
        });
      };

      await loadScript();

      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount * 100, // In kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Circle Name",
              variable_name: "circle_name",
              value: circleName,
            },
          ],
        },
        callback: function (response: any) {
          setLoading(false);
          // Payment complete -> reload page to see confirmed status
          router.refresh();
        },
        onClose: function () {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "An unexpected error occurred during checkout");
    }
  }

  return (
    <Button
      onClick={handlePay}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-600/25"
    >
      {loading ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Opening Escrow...
        </>
      ) : (
        <>
          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
          Pay ₦{amount.toLocaleString()}
        </>
      )}
    </Button>
  );
}
