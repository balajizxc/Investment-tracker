import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState<number>(0);
  const [phase, setPhase] = useState("phase1");
  const [method, setMethod] = useState("upi");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 🔒 Redirect if user is not logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // ✅ Get user from Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return setMessage("❌ Please login to make an investment.");
    }

    // Validate input
    const amountToSubmit = parseFloat(amount.toString());
    if (isNaN(amountToSubmit) || amountToSubmit <= 0) {
      return setMessage("❌ Please enter a valid investment amount.");
    }

    if (!transactionId.trim()) {
      return setMessage("❌ Transaction ID is required.");
    }

    // ✅ Insert into Supabase
    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount: amountToSubmit,
        phase,
        method,
        transaction_id: transactionId.trim(),
        status: "pending",
        start_date: new Date(),
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      setMessage("❌ Failed to submit: " + error.message);
    } else {
      setMessage("✅ Investment submitted. Awaiting approval.");
      setAmount(0);
      setPhase("phase1");
      setMethod("upi");
      setTransactionId("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          💸 Make a New Investment
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount (INR):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            required
            min="1"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phase:</label>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Payment Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="imps">IMPS</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Transaction ID:</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., TXN12345678"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Submit Investment
        </button>

        {message && (
          <p
            className={`mt-4 p-2 text-center rounded ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
