import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Investment {
  amount: number;
  phase: string;
  method: string;
  transaction_id: string;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        const { data, error } = await supabase
          .from("user_investments")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Failed to fetch investments:", error.message);
        } else {
          const total = (data || [])
            .filter((inv) => inv.status === "approved")
            .reduce((sum, inv) => sum + Number(inv.amount), 0);
          setInvestments(data || []);
          setPortfolioValue(total);
        }
      }
    });
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "rejected":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-lg font-semibold">
          💰 Portfolio Value: ₹{portfolioValue.toFixed(2)}
        </p>
        <p className="text-green-600 mt-1">📈 Gains: +10% Monthly (estimated)</p>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">🧾 All Your Investments</h2>

        {investments.length === 0 ? (
          <p className="text-gray-500">No investments yet.</p>
        ) : (
          investments.map((inv, idx) => (
            <div key={idx} className="bg-gray-50 border p-3 rounded mb-3">
              <p className="font-medium">
                ₹{inv.amount} - {inv.phase} via {inv.method}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                TXN: {inv.transaction_id || "N/A"} | Date:{" "}
                {inv.created_at
                  ? new Date(inv.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                  inv.status
                )}`}
              >
                {inv.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-center">
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
