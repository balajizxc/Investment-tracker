// pages/arbitrage.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Arbitrage() {
  const router = useRouter();

  const [fromExchange, setFromExchange] = useState("");
  const [toExchange, setToExchange] = useState("");
  const [profitFrom, setProfitFrom] = useState("");
  const [profitTo, setProfitTo] = useState("");
  const [sortBy, setSortBy] = useState("high");

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/auth/login");
    }
    checkUser();
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔁 Arbitrage Opportunity Finder</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1 font-medium">From Exchange</label>
          <input
            type="text"
            placeholder="e.g. Binance"
            value={fromExchange}
            onChange={(e) => setFromExchange(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">To Exchange</label>
          <input
            type="text"
            placeholder="e.g. KuCoin"
            value={toExchange}
            onChange={(e) => setToExchange(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Profit From (%)</label>
          <input
            type="number"
            placeholder="e.g. 0.5"
            value={profitFrom}
            onChange={(e) => setProfitFrom(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Profit To (%)</label>
          <input
            type="number"
            placeholder="e.g. 5.0"
            value={profitTo}
            onChange={(e) => setProfitTo(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1 font-medium">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="high">High to Low Profit</option>
            <option value="low">Low to High Profit</option>
          </select>
        </div>
      </div>

      <div className="text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
          🔍 Check Arbitrage
        </button>
      </div>
    </div>
  );
}
