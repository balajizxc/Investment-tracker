import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center text-center p-6">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4"
      >
        Welcome to <span className="text-blue-600">Finverg</span>
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl"
      >
        Securely invest, track returns by phase, and grow smarter. Powered by Finverg 💸 — your investment partner for long-term wealth.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-x-4"
      >
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Register
        </Link>
      </motion.div>

      <footer className="mt-16 py-4 text-sm text-gray-600 border-t w-full text-center">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
