import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else {
        setLoading(false); // Show landing page
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-xl">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-50 to-blue-100">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-3 text-blue-900"
      >
        Welcome to Finverg
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-gray-700 mb-6 max-w-md"
      >
        Securely invest, track returns by phase, and grow smarter. Powered by Finverg 💸 — a simple investment tracker built for long-term wealth management.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="space-x-4"
      >
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow"
        >
          Register
        </Link>
      </motion.div>

      <ul className="text-sm mt-6 text-gray-600">
        <li className="my-1">🔒 All transactions are securely stored and transparent.</li>
        <li className="my-1">📊 Real-time portfolio updates with phase-wise gain tracking.</li>
      </ul>

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
