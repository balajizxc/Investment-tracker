import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [investments, setInvestments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return router.push("/auth/login");
      supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .then(({ data }) => setInvestments(data || []));
    });
  }, [router]);

  return (
    <div>
      <h2>Your Approved Investments</h2>
      {investments.length
        ? investments.map((i) => <div key={i.id}>₹{i.amount} via {i.method}</div>)
        : <p>No approved investments yet.</p>}
    </div>
  );
}
