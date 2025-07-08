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
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg-image.jpg')" }} // Place image in /public
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-60 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Welcome to Finverg
          </h1>
          <p className="mb-8 text-lg md:text-xl drop-shadow-sm">
            Securely invest, track returns by phase, and grow smarter. 💸
          </p>

          <div className="space-x-4">
            <Link href="/auth/login" className="bg-blue-600 px-6 py-3 rounded text-white hover:bg-blue-700 transition">
              Login
            </Link>
            <Link href="/auth/register" className="bg-green-600 px-6 py-3 rounded text-white hover:bg-green-700 transition">
              Register
            </Link>
          </div>
        </motion.div>

        <footer className="mt-16 text-sm text-center text-gray-300">
          <p className="mb-1">🔒 All transactions are securely stored and transparent.</p>
          <p>
            📞 Need help? Contact support or join our Telegram community.
            <br />
            💬 <a href="https://t.me/finverg" target="_blank" className="underline text-blue-300">Join Telegram</a> | 
            📧 <a href="mailto:support@finverg.com" className="underline text-blue-300">support@finverg.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
