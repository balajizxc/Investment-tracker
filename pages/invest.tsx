import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState<number | "">("");
  const [phase, setPhase] = useState("phase1");
  const [method, setMethod] = useState("upi");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return setMessage("❌ Login required");

    if (!amount || amount <= 0 || transactionId.trim() === "") {
      return setMessage("❌ Please fill all fields properly.");
    }

    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount,
        phase,
        method,
        transaction_id: transactionId,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Investment submitted! Awaiting approval.");
      setAmount("");
      setPhase("phase1");
      setMethod("upi");
      setTransactionId("");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Make a New Investment</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Investment Phase:</label>
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">💳 Payment Info</h2>
          {method === "upi" && (
            <p className="text-sm">
              <strong>UPI ID:</strong> balajizxc@kotak
            </p>
          )}
          {method === "bank" && (
            <>
              <p className="text-sm"><strong>Account No:</strong> 8750125837</p>
              <p className="text-sm"><strong>IFSC:</strong> KKBK0008763</p>
              <p className="text-sm"><strong>Bank:</strong> Kotak Mahindra, Branch: Pollachi</p>
            </>
          )}
          {method === "card" && (
            <p className="text-sm text-red-500">Card Payment is currently not supported.</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Transaction ID:</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Investment
        </button>

        {message && (
          <p className={`p-2 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}
      </form>

      <div className="mt-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

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
