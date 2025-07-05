import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

// ✅ Define the type for investment
type Investment = {
  id: string;
  user_id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  start_date: string;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved");

      if (error) {
        console.error("Fetch error:", error.message);
      }

      setInvestments(data || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const portfolioValue = investments.reduce((total, inv) => total + inv.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-lg">
          💰 <strong>Portfolio Value:</strong> ₹{portfolioValue.toFixed(2)}
        </p>
        <p className="text-lg">
          📈 <strong>Gains:</strong> +10% Monthly (estimated)
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">🧾 Recent Activity</h2>
      {loading ? (
        <p>Loading investments...</p>
      ) : investments.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li
              key={inv.id}
              className="bg-white p-3 rounded shadow flex justify-between"
            >
              <span>₹{inv.amount} via {inv.method}</span>
              <span className="text-sm text-gray-500">
                {new Date(inv.start_date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <a
          href="/invest"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
