import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Investment {
  id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  transaction_id: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [approvedTotal, setApprovedTotal] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching investments:", error);
        return;
      }

      setInvestments(data || []);

      let approvedTotal = 0;
      let profit = 0;

      (data || [])
        .filter((inv) => inv.status === "approved")
        .forEach((inv) => {
          const createdAt = new Date(inv.created_at);
          const today = new Date();
          const daysHeld = Math.floor(
            (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );

          let dailyRate = 0;

          if (inv.phase === "phase1") {
            dailyRate = 1.0 / 365; // 100% / 365
          } else if (inv.phase === "phase2") {
            dailyRate = 0.6 / 365; // 60%
          } else if (inv.phase === "phase3") {
            dailyRate = 0.3 / 365; // 30%
          }

          approvedTotal += inv.amount;
          profit += inv.amount * dailyRate * daysHeld;
        });

      setApprovedTotal(approvedTotal);
      setTotalProfit(profit);
    });
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <div className="mb-4">
        <p className="text-lg">💰 Portfolio Value: ₹{approvedTotal.toFixed(2)}</p>
        <p className="text-lg text-green-600">
          📈 Gains: ₹{totalProfit.toFixed(2)} (Auto-calculated daily by phase)
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">🧾 All Your Investments</h2>
      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="border border-gray-300 rounded p-4 bg-white shadow"
            >
              <p className="text-gray-800 font-medium">
                ₹{inv.amount} - {inv.phase} via {inv.method}
              </p>
              <p className="text-sm text-gray-600">
                TXN: {inv.transaction_id || "N/A"} | Date:{" "}
                {new Date(inv.created_at).toLocaleDateString("en-IN")}
              </p>
              <span
                className={`text-xs inline-block mt-1 px-2 py-1 rounded font-bold ${
                  inv.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : inv.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {inv.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/invest"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
