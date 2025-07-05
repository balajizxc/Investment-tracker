import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const user = sessionData?.user;

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });

      if (data) {
        setInvestments(data);
        const totalAmount = data.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
        setTotal(totalAmount);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <p className="text-lg mb-2">💰 Portfolio Value: ₹{total.toFixed(2)}</p>
      <p className="text-green-600 mb-4">📈 Gains: +10% Monthly (estimated)</p>

      <h2 className="text-xl font-semibold mb-2">🧾 Recent Activity</h2>
      {investments.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li key={inv.id} className="p-3 bg-white shadow rounded">
              ₹{inv.amount} - {inv.status} ({inv.phase})
              <br />
              <small>{new Date(inv.start_date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
