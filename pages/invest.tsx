import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState<number>(0);
  const [phase, setPhase] = useState<string>("phase1");
  const [method, setMethod] = useState<string>("upi");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const {
      data: { user },
      error: ue,
    } = await supabase.auth.getUser();

    if (ue || !user) {
      return setMessage("❌ Login to invest");
    }

    const amountToSubmit = parseFloat(amount.toString());
    if (isNaN(amountToSubmit) || amountToSubmit <= 0) {
      return setMessage("❌ Please enter a valid positive amount.");
    }

    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount: amountToSubmit,
        phase,
        method,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      setMessage("❌ Submission failed: " + error.message);
    } else {
      setMessage("✅ Submitted — pending approval");
      setAmount(0);
      setPhase("phase1");
      setMethod("upi");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Make a New Investment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phase" className="block text-gray-700 text-sm font-bold mb-2">
            Investment Phase:
          </label>
          <select
            id="phase"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="method" className="block text-gray-700 text-sm font-bold mb-2">
            Payment Method:
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Investment
        </button>

        {message && (
          <p
            className={`mt-4 p-2 rounded ${
              message.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
