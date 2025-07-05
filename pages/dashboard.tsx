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
  start_date: string;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
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
      } else {
        setInvestments(data || []);
      }
    };

    fetchInvestments();
  }, [router]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Dashboard</h2>

      <div className="mb-4">
        💰 <strong>Portfolio Value:</strong> ₹
        {investments.reduce((total, i) => total + i.amount, 0).toFixed(2)}
      </div>

      <div className="mb-4">📈 Gains: +10% Monthly (estimated)</div>

      <h3 className="text-lg font-semibold mb-2">🧾 Recent Activity</h3>
      {investments.length === 0 ? (
        <p>No approved investments yet.</p>
      ) : (
        <ul>
          {investments.map((inv) => (
            <li key={inv.id}>
              ₹{inv.amount} via {inv.method} ({inv.phase})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
