import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserEmail(session.user.email || "");
      } else {
        router.push("/auth/login"); // redirect to login if not authenticated
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        <p className="mb-4">Logged in as: <strong>{userEmail}</strong></p>

        <div className="mb-4">
          <p className="text-lg">💰 Portfolio Value: <strong>$0.00</strong></p>
          <p className="text-lg">📈 Gains: <strong>+0%</strong></p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">🧾 Recent Activity:</h2>
          <p className="text-gray-600">None</p>
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
