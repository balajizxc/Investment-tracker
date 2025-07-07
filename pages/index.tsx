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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-xl w-full"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800">Welcome to Finverg</h1>
        <p className="mb-6 text-gray-700 text-lg">
          Securely invest, track returns by phase, and grow smarter. Powered by Finverg 💸
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Register
          </Link>
        </div>
      </motion.div>

      <footer className="mt-10 text-sm text-gray-800 text-center">
        <p className="mb-1">🔒 All transactions are securely stored and transparent.</p>
        <p className="mb-1">📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬{" "}
          <a href="https://t.me/finverg" target="_blank" className="text-blue-900 underline">
            Join Telegram
          </a>{" "}
          | 📧{" "}
          <a href="mailto:support@finverg.com" className="text-blue-900 underline">
            support@finverg.com
          </a>
        </p>
      </footer>
    </div>
  );
}
