// pages/invest.tsx

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Invest() {
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState("phase1");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: sessionData } = await supabase.auth.getUser();
    const user = sessionData?.user;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase.from("user_investments").insert({
      user_id: user.id,
      amount,
      phase,
      status: "pending", // important: do not auto-approve
      start_date: new Date(),
    });

    if (error) {
      setMessage("❌ Failed to submit deposit");
    } else {
      setMessage("✅ Deposit submitted for approval");
      setAmount("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">💸 Submit a New Investment</h2>

        <input
          type="number"
          placeholder="Amount (INR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />

        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="mb-4 p-2 border w-full"
        >
          <option value="phase1">Phase 1</option>
          <option value="phase2">Phase 2</option>
        </select>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 w-full rounded"
        >
          Submit
        </button>

        {message && <p className="mt-3 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
