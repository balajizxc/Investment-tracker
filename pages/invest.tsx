import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState(0);
  const [phase, setPhase] = useState("phase1");
  const [method, setMethod] = useState("upi");
  const [txnId, setTxnId] = useState("");
  const [message, setMessage] = useState("");
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
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return setMessage("❌ Login to invest");
    }

    if (!amount || amount <= 0) {
      return setMessage("❌ Please enter a valid amount");
    }

    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount,
        phase,
        method,
        transaction_id: txnId,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("❌ Submission failed");
    } else {
      setMessage("✅ Investment submitted! Awaiting approval.");
      setAmount(0);
      setTxnId("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Make a New Investment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Investment Phase:</label>
          <select value={phase} onChange={(e) => setPhase(e.target.value)} className="w-full border p-2 rounded">
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        <div>
          <label>Payment Method:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border p-2 rounded">
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="imps">IMPS</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
          <p className="font-semibold">💳 Payment Info</p>
          <p>UPI ID: <strong>balajizxc@kotak</strong></p>
          <p>Account No: <strong>8750125837</strong></p>
          <p>IFSC: <strong>KKBK0008763</strong></p>
          <p>Bank: Kotak Mahindra, Branch: Pollachi</p>
        </div>

        <div>
          <label>Transaction ID:</label>
          <input
            type="text"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Investment
        </button>

        {message && (
          <p className={`p-2 mt-2 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}
      </form>

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
