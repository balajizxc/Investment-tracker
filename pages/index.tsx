import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Welcome to Finverg</h1>
      <p className="mb-6 text-gray-700">Track your investments and grow smarter 🚀</p>

      <div className="space-x-4">
        <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>

      <footer className="mt-10 py-4 text-sm text-gray-600 border-t w-full text-center">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
