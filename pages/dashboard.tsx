// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

interface Investment {
  id: number;
  amount: number;
  date: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setInvestments(data as Investment[]);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Investment Dashboard</h1>

      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id}>
                <td className="border border-gray-300 px-4 py-2">{inv.id}</td>
                <td className="border border-gray-300 px-4 py-2">₹{inv.amount}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(inv.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
