import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Investment {
  id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  transaction_id?: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filter, setFilter] = useState("approved");
  const [total, setTotal] = useState(0);
  const [gain, setGain] = useState(0);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");

      let query = supabase.from("user_investments").select("*").eq("user_id", user.id);
      if (filter !== "all") query = query.eq("status", filter);

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) return console.error(error);

      setInvestments(data || []);

      let tot = 0,
        g = 0;
      data?.forEach((inv) => {
        if (inv.status === "approved") {
          tot += inv.amount;
          const days = (Date.now() - new Date(inv.created_at).getTime()) / (1000 * 60 * 60 * 24);
          const rate = inv.phase === "phase1" ? 1 : inv.phase === "phase2" ? 0.6 : 0.3;
          g += (inv.amount * rate * days) / 365;
        }
      });
      setTotal(parseFloat(tot.toFixed(2)));
      setGain(parseFloat(g.toFixed(2)));
    })();
  }, [filter, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Summary */}
      <div className="my-4">
        <p>💰 Portfolio Value: ₹{total}</p>
        <p className="text-green-600">📈 Gains: ₹{gain} (daily/phase)</p>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Investment List */}
      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="border p-4 rounded bg-white shadow">
              <p className="font-medium">
                ₹{inv.amount} - {inv.phase} via {inv.method}
              </p>
              <p className="text-sm">
                TXN: {inv.transaction_id || "N/A"} | Date:{" "}
                {new Date(inv.created_at).toLocaleDateString()}
              </p>
              <p
                className={`${
                  inv.status === "approved"
                    ? "text-green-600"
                    : inv.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                } font-semibold`}
              >
                {inv.status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        <a
          href="/invest"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
        <a
          href="/arbitrage"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          🔁 Arbitrage
        </a>
        <button
          onClick={() => alert("Coming soon...")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          💸 Earn
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-10 py-4 text-center text-sm text-gray-600 border-t">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
