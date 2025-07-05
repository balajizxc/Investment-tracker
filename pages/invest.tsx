// pages/invest.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InvestPage() {
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get current logged-in user ID
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        router.push("/auth/login");
      }
    };
    getUser();
  }, []);

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, user_id: userId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Investment successful!");
      setAmount("");
    } else {
      setMessage(`❌ Failed: ${data.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleInvest} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Make an Investment</h2>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (INR)"
          className="mb-4 p-2 border w-full"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700"
          disabled={!userId}
        >
          Invest
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
