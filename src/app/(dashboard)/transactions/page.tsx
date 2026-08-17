import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Clock, ShieldCheck } from "lucide-react";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all transactions involving user or their circles
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, circle:circles(name), profile:profiles(full_name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Transaction History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete ledger of all your rotating contributions, payouts, and escrow records.
        </p>
      </div>

      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Ledger Records</CardTitle>
          <CardDescription className="text-xs">
            Every transaction is instantly verified, cryptographically signed, and permanently recorded on the immutable ledger.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {(!transactions || transactions.length === 0) ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No transactions recorded yet. Once you make your first circle contribution, it will appear here.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {transactions.map((tx: any) => {
                const isContribution = tx.type === "contribution";

                return (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          isContribution
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {isContribution ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">
                            {isContribution ? "Circle Contribution" : "Rotation Round Payout"}
                          </p>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {tx.circle?.name ?? "Savings Pool"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          Receipt: {tx.paystack_reference} • Round #{tx.round_number} • {new Date(tx.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p
                        className={`text-sm font-extrabold ${
                          isContribution
                            ? "text-foreground"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isContribution ? "-" : "+"}₦{Number(tx.amount).toLocaleString()}
                      </p>
                      <Badge
                        className={`text-[9px] ${
                          tx.status === "confirmed"
                            ? "bg-emerald-600 text-white"
                            : tx.status === "pending"
                            ? "bg-amber-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
