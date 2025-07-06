import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface Investment {
  id: string;
  user_id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching investments:", error.message);
        return;
      }

      if (data) {
        setInvestments(data);
        const totalValue = data.reduce((acc, inv) => acc + inv.amount, 0);
        setTotal(totalValue);
      }
    };

    fetchInvestments();
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <div className="mb-4">
        <p className="text-lg">💰 Portfolio Value: ₹{total.toFixed(2)}</p>
        <p className="text-green-600">📈 Gains: +10% Monthly (estimated)</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">🧾 Recent Activity</h2>
      {investments.length === 0 ? (
        <p>No investments yet.</p>
      ) : (
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li key={inv.id} className="p-3 bg-gray-100 rounded shadow-sm">
              <p>Amount: ₹{inv.amount}</p>
              <p>Phase: {inv.phase}</p>
              <p>Method: {inv.method}</p>
              <p>Submitted: {new Date(inv.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <a
          href="/invest"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Make New Investment
        </a>
      </div>
    </div>
  );
}
