import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-800">Welcome to Finverg</h1>
      <p className="mb-6 text-gray-700 max-w-xl text-center">
        Securely invest, track returns by phase, and grow smarter. Powered by Finverg 💸 — a simple investment tracker built for long-term wealth management.
      </p>

      <div className="space-x-4 mb-6">
        <Link href="/auth/login" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/auth/register" className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>

      <div className="text-sm text-gray-500 mb-2">🔒 All transactions are securely stored and transparent.</div>

      <footer className="mt-10 py-4 text-center text-sm text-gray-600 border-t w-full">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
