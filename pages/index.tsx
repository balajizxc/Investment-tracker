// pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase"; // assuming you've centralized client here
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
      else router.push("/auth/login");
    });
  }, [router]);

  return (
    <div className="text-center mt-10">
      Redirecting…
      <Footer />
    </div>
  );
}
