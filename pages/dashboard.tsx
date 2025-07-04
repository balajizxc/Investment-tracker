import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth/login"); // redirect to login if not logged in
      } else {
        setUser(session.user);
      }
    };
    getUser();
  }, [router]);

  if (!user) return <p className="p-4">Loading your dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📊 Dashboard</h1>
      <p className="mb-1">👋 Welcome, {user.email}</p>
      <p className="mb-1">💰 Portfolio Value: $0.00</p>
      <p className="mb-1">📈 Gains: +0%</p>
      <p className="mb-1">🧾 Recent Activity: None</p>
    </div>
  );
}
