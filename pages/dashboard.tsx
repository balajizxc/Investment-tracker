import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

type Investment = {
  id: string;
  user_id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved");

      if (fetchError) {
        console.error("Fetch error:", fetchError.message);
      } else {
        setInvestments(data || []);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <p className="mb-2">💰 Portfolio Value: ₹{investments.reduce((sum, inv) => sum + inv.amount, 0)}</p>
      <p className="mb-4">📈 Gains: +10% Monthly (estimated)</p>

      <h2 className="text-lg font-semibold mb-2">🧾 Recent Activity</h2>
      {investments.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li key={inv.id} className="bg-gray-100 p-3 rounded">
              ₹{inv.amount} — {inv.phase} — {inv.method} — {new Date(inv.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <a
          href="/invest"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
