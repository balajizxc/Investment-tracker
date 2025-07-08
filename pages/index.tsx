import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  const handleArbitrageClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/arbitrage');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Welcome to <span className="text-purple-700">Finverg</span></h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl leading-relaxed">
        Securely invest, track returns by investment phase, and grow your wealth smarter with analytics-driven insights.
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow">Login</button>
        </Link>
        <Link href="/register">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow">Register</button>
        </Link>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow"
          onClick={handleArbitrageClick}
        >
          Arbitrage
        </button>
      </div>

      <footer className="text-gray-500 text-sm flex gap-2 items-center justify-center">
        <span>💬 <a href="https://t.me/finverg" className="underline">Join Telegram</a></span>
        <span>|</span>
        <span>📧 support@finverg.com</span>
      </footer>
    </div>
  );
}
