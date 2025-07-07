import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581091012184-7abcb89e90cd?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-60 flex-1 flex flex-col items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          Welcome to <span className="text-green-400">Finverg</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-center max-w-2xl mb-6"
        >
          Securely invest, track returns by phase, and grow smarter. Built for long-term wealth management 💸
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex space-x-4 mb-10"
        >
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded text-white font-semibold"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded text-white font-semibold"
          >
            Register
          </Link>
        </motion.div>

        <ul className="text-sm text-gray-200 space-y-2 text-center">
          <li>✅ Transparent and secure investment tracking</li>
          <li>📈 Auto-calculated daily gains</li>
          <li>🔒 Your data stays private</li>
        </ul>
      </div>

      <footer className="bg-black bg-opacity-70 py-4 text-center text-sm text-gray-300 border-t border-gray-700">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-400 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-400 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
