import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Arbitrage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-4">Arbitrage Dashboard</h1>
      <p className="text-lg text-gray-600 text-center">
        This section will soon provide real-time arbitrage opportunities between crypto exchanges.
      </p>
    </div>
  );
}
