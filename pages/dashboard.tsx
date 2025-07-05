// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        router.push("/auth/login"); // Redirect if not logged in
      } else {
        setUser(user);
        await fetchInvestments(user.id);
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  const fetchInvestments = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_investments")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching investments:", error.message);
      return;
    }

    setInvestments(data || []);
    const total = data?.reduce((sum, item) => sum + item.amount, 0) || 0;
    setPortfolioValue(total);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        <div className="mb-6">
          <p className="text-lg font-semibold">💰 Portfolio Value: ₹{portfolioValue.toFixed(2)}</p>
          <p className="text-sm text-green-600">📈 Gains: +10% Monthly (estimated)</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">🧾 Recent Activity</h2>
          {investments.length === 0 ? (
            <p>No investments yet.</p>
          ) : (
            <ul className="space-y-2">
              {investments.map((inv) => (
                <li key={inv.id} className="p-3 border rounded bg-gray-50">
                  ₹{inv.amount} - {inv.phase} - {new Date(inv.start_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/invest"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Make New Investment
          </a>
        </div>
      </div>
    </div>
  );
}
