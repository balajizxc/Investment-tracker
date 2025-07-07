// pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm w-full py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">💸 Finverg</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Register
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to Finverg</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
          Securely invest, track returns by phase, and grow smarter. Finverg is your companion in long-term wealth building.
        </p>
        <ul className="text-gray-700 space-y-2 mb-8 text-sm md:text-base">
          <li>✅ Transparent, secure investment tracking</li>
          <li>📈 Auto-calculated daily gains based on phase returns</li>
          <li>🔒 Your data is safe and encrypted</li>
        </ul>
        <div className="space-x-4">
          <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/auth/register" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Get Started
          </Link>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t text-center text-sm text-gray-600 px-4">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
