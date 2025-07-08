// File: pages/index.tsx import { useEffect } from "react"; import { useRouter } from "next/router"; import Link from "next/link"; import { supabase } from "../lib/supabase";

export default function Home() { const router = useRouter();

useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (session) router.push("/dashboard"); }); }, []);

return ( <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col items-center justify-center text-center p-6"> <h1 className="text-4xl font-bold mb-4">Welcome to Finverg</h1> <p className="mb-6 text-gray-700 max-w-md"> Securely invest, track returns by investment phase, and grow your wealth smarter with analytics-driven insights. </p>

<div className="flex space-x-4">
    <Link href="/auth/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
    <Link href="/auth/register" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Register</Link>
    <Link href="/arbitrage" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Arbitrage</Link>
  </div>

  <footer className="mt-10 py-4 text-sm text-gray-600 border-t w-full text-center">
    <p>💬 <a href="https://t.me/finverg" className="text-blue-600 underline" target="_blank">Join Telegram</a> | 📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a></p>
  </footer>
</div>

); }
