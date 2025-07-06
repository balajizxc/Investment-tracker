import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Investment {
  amount: number;
  phase: string;
  method: string;
  transaction_id: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
      else {
        supabase
          .from("user_investments")
          .select("*")
          .eq("user_id", user.id)
          .then(({ data }) => {
            setInvestments(data || []);
          });
      }
    });
  }, [router]);

  const getFilteredInvestments = () => {
    return statusFilter === "all"
      ? investments
      : investments.filter((inv) => inv.status === statusFilter);
  };

  const approvedInvestments = investments.filter((inv) => inv.status === "approved");

  const totalApproved = approvedInvestments.reduce((sum, inv) => sum + inv.amount, 0);

  const getInterest = (amount: number, phase: string) => {
    const rate = phase === "phase1" ? 0.1 : phase === "phase2" ? 0.07 : 0.05;
    return amount * rate;
  };

  const chartData = approvedInvestments.map((inv) => ({
    date: new Date(inv.created_at).toLocaleDateString("en-GB"),
    amount: inv.amount,
  }));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          💰 <strong>Total Investment:</strong> ₹{totalApproved.toFixed(2)}
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          📈 <strong>Estimated Interest:</strong> ₹
          {approvedInvestments.reduce((sum, inv) => sum + getInterest(inv.amount, inv.phase), 0).toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">🔎 Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {getFilteredInvestments().map((inv, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow border">
            <div>₹{inv.amount} - {inv.phase} via {inv.method}</div>
            <div>TXN: {inv.transaction_id || "N/A"}</div>
            <div>Date: {new Date(inv.created_at).toLocaleDateString("en-GB")}</div>
            <div className="mt-1 text-sm text-gray-600 font-semibold uppercase tracking-wide">
              {inv.status}
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">📈 Investment Chart</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
