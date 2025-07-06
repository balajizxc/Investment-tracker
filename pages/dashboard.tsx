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
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filter, setFilter] = useState("approved"); // default: approved
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalGain, setTotalGain] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");

      const query = supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id);

      if (filter !== "all") {
        query.eq("status", filter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data) {
        setInvestments(data);

        // Calculate portfolio and gain for APPROVED only
        const approved = data.filter((inv) => inv.status === "approved");
        const total = approved.reduce((sum, inv) => sum + inv.amount, 0);
        const gains = approved.reduce((sum, inv) => {
          const days = Math.floor(
            (new Date().getTime() - new Date(inv.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          const rate =
            inv.phase === "phase1"
              ? 1
              : inv.phase === "phase2"
              ? 0.6
              : inv.phase === "phase3"
              ? 0.3
              : 0;
          const gain = (inv.amount * rate * days) / 365;
          return sum + gain;
        }, 0);

        setTotalApproved(total);
        setTotalGain(Number(gains.toFixed(2)));
      }
    };

    fetchData();
  }, [filter, router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">📊 Investment Dashboard</h1>

      <div className="mb-4">
        <p className="text-lg">💰 Portfolio Value: ₹{totalApproved.toFixed(2)}</p>
        <p className="text-lg">📈 Gains: ₹{totalGain.toFixed(2)} (Auto-calculated daily by phase)</p>
      </div>

      <div className="mb-4">
        <label htmlFor="filter" className="block text-sm font-semibold text-gray-700 mb-1">
          Filter by Status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-3">🧾 Your Investments</h2>
      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="border p-4 rounded shadow-sm bg-white">
              <p className="font-medium text-lg">
                ₹{inv.amount} - {inv.phase} via {inv.method}
              </p>
              <p className="text-sm">
                TXN: {inv.transaction_id || "N/A"} | Date:{" "}
                {new Date(inv.created_at).toLocaleDateString()}
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  inv.status === "approved"
                    ? "text-green-600"
                    : inv.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {inv.status.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/invest"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
