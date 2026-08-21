import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PersonalTransactionsView, UnifiedTransaction } from "@/components/profile/PersonalTransactionsView";

export default async function PersonalTransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin, admin_role")
    .eq("id", user!.id)
    .single();

  const isSuperAdmin =
    profile?.admin_role === "super_admin" ||
    (profile?.is_admin && profile?.admin_role !== "helper_admin");

  const cookieStore = await cookies();
  const simId = cookieStore.get("kadashe_simulation_id")?.value;

  let effectiveUserId = user!.id;
  if (simId && isSuperAdmin) {
    effectiveUserId = simId;
  }

  const adminDb = createAdminClient();

  // Fetch all personal transactions from `transactions` table (Circle contributions & payouts)
  const { data: circleTx } = await adminDb
    .from("transactions")
    .select("id, amount, round_number, type, status, paystack_reference, source, created_at, circle:circles(name)")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false });

  // Fetch all personal wallet entries from `wallet_ledger` (Fund, Payout credits, Withdrawals, Debit contributions)
  const { data: walletEntries } = await adminDb
    .from("wallet_ledger")
    .select("id, amount, direction, type, status, reference, description, created_at")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false });

  // Unify and deduplicate entries into a single master timeline
  const unifiedList: UnifiedTransaction[] = [];

  // 1. Add wallet ledger entries (top-ups, withdrawals)
  (walletEntries ?? []).forEach((w: any) => {
    if (w.type === "fund") {
      unifiedList.push({
        id: `wallet_${w.id}`,
        category: "wallet_fund",
        title: "Wallet Top-Up",
        subtitle: w.description || "Personal wallet funding via Paystack",
        amount: Number(w.amount),
        direction: "credit",
        status: w.status,
        reference: w.reference,
        date: w.created_at,
        source: "Paystack Top-Up",
      });
    } else if (w.type === "withdraw") {
      unifiedList.push({
        id: `wallet_${w.id}`,
        category: "bank_withdraw",
        title: "Bank Account Withdrawal",
        subtitle: w.description || "Disbursement to linked verified bank account",
        amount: Number(w.amount),
        direction: "debit",
        status: w.status,
        reference: w.reference,
        date: w.created_at,
        source: "Bank Transfer",
      });
    }
  });

  // 2. Add circle transactions (Pool contributions and Payouts)
  (circleTx ?? []).forEach((tx: any) => {
    const isContribution = tx.type === "contribution";
    const circleName = (tx.circle as any)?.name || "Savings Circle";

    if (isContribution) {
      const isFailedOrDeclined = tx.status === "declined" || tx.status === "failed" || tx.status === "abandoned";
      const paymentDetail = isFailedOrDeclined
        ? "Paystack Checkout Cancelled / Declined"
        : tx.source === "wallet"
        ? "Paid from Wallet"
        : "Paid via Paystack";

      unifiedList.push({
        id: `tx_${tx.id}`,
        category: "pool_contribution",
        title: `Circle Contribution — ${circleName}`,
        subtitle: `Round #${tx.round_number || 1} Escrow Contribution (${paymentDetail})`,
        amount: Number(tx.amount),
        direction: "debit",
        status: tx.status,
        reference: tx.paystack_reference,
        date: tx.created_at,
        source: tx.source === "wallet" ? "Wallet" : "Paystack",
        circleName,
        roundNumber: tx.round_number,
      });
    } else {
      unifiedList.push({
        id: `tx_${tx.id}`,
        category: "pool_payout",
        title: `Round Payout Received — ${circleName}`,
        subtitle: `Round #${tx.round_number || 1} Rotational Lump-Sum Payout`,
        amount: Number(tx.amount),
        direction: "credit",
        status: tx.status,
        reference: tx.paystack_reference,
        date: tx.created_at,
        source: "Pool Escrow Payout",
        circleName,
        roundNumber: tx.round_number,
      });
    }
  });

  // Sort unified list descending by timestamp
  unifiedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <PersonalTransactionsView
      transactions={unifiedList}
      userName={profile?.full_name || "Member"}
    />
  );
}
