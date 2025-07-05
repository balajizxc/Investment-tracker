// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (!error) setInvestments(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const total = investments.reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <p className="mb-2">Welcome, <strong>{userEmail}</strong></p>
      <p className="mb-2">💰 Portfolio Value: ₹{total.toFixed(2)}</p>
      <p className="mb-4">📈 Gains: +10% Monthly (estimated)</p>

      <h2 className="text-lg font-semibold mb-2">🧾 Recent Activity</h2>
      {loading ? <p>Loading...</p> : (
        investments.length === 0
          ? <p>No investments yet.</p>
          : (
            <ul className="space-y-2">
              {investments.map(inv => (
                <li key={inv.id} className="bg-white p-3 rounded shadow-md">
                  ₹{inv.amount} - {inv.phase} - {new Date(inv.start_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )
      )}

      <div className="mt-6">
        <a href="/invest" className="text-blue-600 hover:underline">➕ Make New Investment</a>
      </div>
    </div>
  );
}
