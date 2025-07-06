import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

type Investment = {
  id: string;
  amount: number;
  phase: string;
  method: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return router.push("/auth/login");

      supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .then(({ data }) => {
          setInvestments(data || []);
          setLoading(false);
        });
    });
  }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : investments.length === 0 ? (
        <p>No approved investments found.</p>
      ) : (
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li key={inv.id} className="bg-gray-100 p-3 rounded">
              💰 Amount: ₹{inv.amount} — Phase: {inv.phase} — Method: {inv.method}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
