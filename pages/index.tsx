// pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are set in .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error.message);
          return router.push("/auth/login");
        }

        if (session) {
          router.push("/dashboard");
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        router.push("/auth/login");
      }
    };

    checkSession();
  }, [router]);

  return <div className="text-center mt-10">Redirecting...</div>;
}
