// pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-redirect if already logged in
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session) router.push("/dashboard");
    // });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white">
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-4"
        >
          Welcome to Finverg 💸
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg max-w-2xl mb-8 text-gray-200"
        >
          Securely invest, track returns by phase, and grow smarter. Powered by Finverg —
          your simple and transparent investment platform for long-term wealth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex gap-6"
        >
          <Link
            href="/auth/login"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-blue-100 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-400 text-white px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-green-500 transition"
          >
            Register
          </Link>
        </motion.div>
      </main>

      <footer className="py-6 text-center border-t border-white/20 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>📞 Need help? Contact support or join our Telegram community.</p>
          <p className="mt-2">
            💬{" "}
            <a
              href="https://t.me/finverg"
              target="_blank"
              className="underline text-blue-300"
            >
              Join Telegram
            </a>{" "}
            | 📧{" "}
            <a
              href="mailto:support@finverg.com"
              className="underline text-blue-300"
            >
              support@finverg.com
            </a>
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
