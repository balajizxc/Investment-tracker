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
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-4 text-center"
      >
        Welcome to <span className="text-yellow-300">Finverg</span>
      </motion.h1>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl text-center"
      >
        Securely invest, track returns by phase, and grow smarter 💸
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-x-4"
      >
        <Link
          href="/auth/login"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="inline-block bg-white hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Register
        </Link>
      </motion.div>

      <footer className="mt-16 py-4 text-sm text-gray-300 border-t border-gray-500 w-full text-center">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬{" "}
          <a
            href="https://t.me/finverg"
            target="_blank"
            className="text-yellow-300 underline"
          >
            Join Telegram
          </a>{" "}
          | 📧{" "}
          <a
            href="mailto:support@finverg.com"
            className="text-yellow-300 underline"
          >
            support@finverg.com
          </a>
        </p>
      </footer>
    </div>
  );
}
