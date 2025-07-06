import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [investments, setInvestments] = useState<
    {
      amount: number;
      phase: string;
      method: string;
      transaction_id: string;
      created_at: string;
    }[]
  >([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        const { data, error } = await supabase
          .from("user_investments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "approved");

        if (error) {
          console.error("Failed to fetch investments:", error.message);
        } else {
          setInvestments(data || []);
          const total = (data || []).reduce(
            (sum, inv) => sum + Number(inv.amount),
            0
          );
          setPortfolioValue(total);
        }
      }
    });
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-lg font-semibold">
          💰 Portfolio Value: ₹{portfolioValue.toFixed(2)}
        </p>
        <p className="text-green-600">📈 Gains: +10% Monthly (estimated)</p>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">
          🧾 Recent Approved Investments
        </h2>

        {investments.length === 0 ? (
          <p className="text-gray-500">No approved investments yet.</p>
        ) : (
          investments.map((inv, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded mb-2">
              <p>
                ₹{inv.amount} - {inv.phase} via {inv.method}
              </p>
              <p className="text-sm text-gray-600">
                TXN: {inv.transaction_id} | Date:{" "}
                {inv.created_at
                  ? new Date(inv.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
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
