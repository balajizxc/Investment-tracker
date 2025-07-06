import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

type Investment = {
  id: number;
  user_id: string;
  amount: number;
  phase: string;
  method: string;
  transaction_id: string;
  status: string;
  start_date: string;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching investments:", error.message);
      } else {
        setInvestments(data || []);
        const totalValue = (data || []).reduce(
          (sum, inv) => sum + (inv.amount || 0),
          0
        );
        setTotal(totalValue);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <div className="mb-6 p-4 border rounded bg-white shadow">
        <p className="text-lg font-semibold">
          💰 Portfolio Value: ₹{total.toFixed(2)}
        </p>
        <p className="text-green-700">📈 Gains: +10% Monthly (estimated)</p>
      </div>

      <div className="mb-6 p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">🧾 Recent Approved Investments</h2>
        {investments.length === 0 ? (
          <p>No approved investments yet.</p>
        ) : (
          <ul className="space-y-2">
            {investments.map((inv) => (
              <li
                key={inv.id}
                className="border-b pb-2 text-sm text-gray-800"
              >
                ₹{inv.amount} - {inv.phase} via {inv.method} <br />
                <span className="text-gray-500 text-xs">
                  TXN: {inv.transaction_id} | Date:{" "}
                  {new Date(inv.start_date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center">
        <a
          href="/invest"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
