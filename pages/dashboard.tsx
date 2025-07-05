// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push("/auth/login"); // Not logged in → redirect
      } else {
        setUserEmail(data.session.user.email);
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        <p className="mb-2">Welcome, <strong>{userEmail}</strong></p>

        <div className="mb-4">
          <p>💰 Portfolio Value: <strong>$0.00</strong></p>
          <p>📈 Gains: <strong>+0%</strong></p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">🧾 Recent Activity</h2>
          <p className="text-gray-600">No recent activity.</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
