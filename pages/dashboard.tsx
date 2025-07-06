import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Investment {
  amount: number;
  phase: string;
  method: string;
  transaction_id: string;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filtered, setFiltered] = useState<Investment[]>([]);
  const [filter, setFilter] = useState("all");
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        const { data, error } = await supabase
          .from("user_investments")
          .select("*")
          .eq("user_id", user.id);

        if (!error && data) {
          setInvestments(data);
          setFiltered(data);
          const approved = data.filter((inv) => inv.status === "approved");

          const total = approved.reduce((sum, inv) => sum + Number(inv.amount), 0);
          setPortfolioValue(total);

          // Calculate current value with interest
          const valueWithInterest = approved.reduce((sum, inv) => {
            const interest = getInterestRate(inv.phase);
            return sum + Number(inv.amount) * (1 + interest / 100);
          }, 0);

          setCurrentValue(valueWithInterest);
        }
      }
    });
  }, [router]);

  const handleFilter = (status: string) => {
    setFilter(status);
    if (status === "all") {
      setFiltered(investments);
    } else {
      setFiltered(investments.filter((inv) => inv.status === status));
    }
  };

  const getInterestRate = (phase: string) => {
    switch (phase) {
      case "phase1": return 10;
      case "phase2": return 12;
      case "phase3": return 15;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const chartData = investments
    .filter((inv) => inv.status === "approved")
    .map((inv) => ({
      name: inv.phase,
      value: Number(inv.amount),
    }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg">💰 Total Investment</p>
          <p className="font-bold text-xl text-blue-600">₹{portfolioValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg">📈 Current Value (with Interest)</p>
          <p className="font-bold text-xl text-green-600">₹{currentValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg">🧮 Total Returns</p>
          <p className="font-bold text-xl text-purple-600">
            ₹{(currentValue - portfolioValue).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">📊 Investment by Phase</h2>
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No approved investments for chart.</p>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mb-4 space-x-2">
        {["all", "pending", "approved", "rejected"].map((stat) => (
          <button
            key={stat}
            onClick={() => handleFilter(stat)}
            className={`px-3 py-1 rounded capitalize ${
              filter === stat ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {stat}
          </button>
        ))}
      </div>

      {/* Table View */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Phase</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Txn ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">₹{inv.amount}</td>
                <td className="px-4 py-2">{inv.phase}</td>
                <td className="px-4 py-2">{inv.method}</td>
                <td className="px-4 py-2">{inv.transaction_id || "N/A"}</td>
                <td className="px-4 py-2">
                  {inv.created_at
                    ? new Date(inv.created_at).toLocaleDateString("en-IN")
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded font-semibold ${getStatusColor(inv.status)}`}>
                    {inv.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-4 text-gray-500">No investments found.</p>
        )}
      </div>

      {/* Link to invest */}
      <div className="mt-6 text-center">
        <a
          href="/invest"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
