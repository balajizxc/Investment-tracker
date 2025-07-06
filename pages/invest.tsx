import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Invest() {
  const [amount, setAmount] = useState<number>(0);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return setMessage("❌ Please log in to submit an investment.");
    }

    const amountToSubmit = parseFloat(amount.toString());
    if (isNaN(amountToSubmit) || amountToSubmit <= 0) {
      return setMessage("❌ Invalid amount.");
    }

    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount: amountToSubmit,
        phase,
        method,
        transaction_id: txnId || "N/A",
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("❌ Submission failed: " + error.message);
    } else {
      setMessage("✅ Investment submitted! Awaiting approval.");
      setAmount(0);
      setTxnId("");
      setPhase("phase1");
      setMethod("upi");
      setTimeout(() => router.push("/dashboard"), 2000); // redirect after success
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Make a New Investment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          required
        />
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="phase1">Phase 1</option>
          <option value="phase2">Phase 2</option>
        </select>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="upi">UPI</option>
          <option value="bank">Bank Transfer</option>
        </select>
        <input
          type="text"
          placeholder="Transaction ID"
          className="w-full border p-2 rounded"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Investment
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
