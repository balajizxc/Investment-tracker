import { useState } from "react";

export default function ArbitragePage() {
  const exchanges = [
    "Binance",
    "Bitget",
    "Weex",
    "MEXC",
    "Bybit",
    "Gate.io",
    "BitMart",
    "KuCoin",
    "LBank",
    "OKX",
  ];

  const [fromExchange, setFromExchange] = useState("");
  const [toExchange, setToExchange] = useState("");
  const [profitFrom, setProfitFrom] = useState("");
  const [profitTo, setProfitTo] = useState("");
  const [sortOrder, setSortOrder] = useState("highToLow");

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">🔁 Arbitrage Checker</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">From Exchange</label>
          <select
            value={fromExchange}
            onChange={(e) => setFromExchange(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select exchange</option>
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">To Exchange</label>
          <select
            value={toExchange}
            onChange={(e) => setToExchange(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select exchange</option>
            {exchanges.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Profit From</label>
          <input
            type="number"
            placeholder="Enter profit from %"
            value={profitFrom}
            onChange={(e) => setProfitFrom(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Profit To</label>
          <input
            type="number"
            placeholder="Enter profit to %"
            value={profitTo}
            onChange={(e) => setProfitTo(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="highToLow">High to Low Profit</option>
            <option value="lowToHigh">Low to High Profit</option>
          </select>
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
          onClick={() => {
            alert("Feature coming soon...");
          }}
        >
          🔍 Check Arbitrage Opportunities
        </button>
      </div>
    </div>
  );
}
