// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching investments:", error.message);
      } else {
        setInvestments(data || []);
      }

      setLoading(false);
    };

    fetchInvestments();
  }, [router]);

  const total = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>

        <p className="text-lg mb-2">💰 Portfolio Value: ₹{total.toFixed(2)}</p>
        <p className="text-md mb-4">📈 Gains: +10% Monthly (estimated)</p>

        <h3 className="text-lg font-semibold mb-2">🧾 Recent Activity</h3>
        {loading ? (
          <p>Loading...</p>
        ) : investments.length === 0 ? (
          <p>No investments yet.</p>
        ) : (
          <ul className="space-y-2">
            {investments.map((inv) => (
              <li key={inv.id} className="border p-2 rounded">
                ₹{inv.amount} - {inv.phase} - {inv.status}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-center">
          <a
            href="/invest"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ➕ Make New Investment
          </a>
        </div>
      </div>
    </div>
  );
}
