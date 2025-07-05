import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState<number>(0);
  const [phase, setPhase] = useState<string>("phase1");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // ✅ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("❌ User not logged in");
      return;
    }

    console.log("User UID:", user.id);

    // ✅ Insert investment using 'uid'
    const { error } = await supabase.from("user_investments").insert([
      {
        uid: user.id,
        amount,
        phase,
        status: "pending",
        start_date: new Date(),
      },
    ]);

    if (error) {
      console.error("Insert error:", error.message, error.details, error.hint);
      setMessage("❌ Failed to submit deposit");
    } else {
      setMessage("✅ Deposit submitted for approval");
      setAmount(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">💸 Submit a New Investment</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mb-4 p-2 border w-full rounded"
          required
        />

        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="mb-4 p-2 border w-full rounded"
        >
          <option value="phase1">Phase 1</option>
          <option value="phase2">Phase 2</option>
          <option value="phase3">Phase 3</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700"
        >
          Submit
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
