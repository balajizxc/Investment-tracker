import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Finverg</h1>
      <p className="mb-6 text-lg text-gray-700">
        Securely invest, track returns by phase, and grow smarter.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Register</button>
        </Link>
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={handleArbitrageClick}
        >
          Arbitrage
        </button>
      </div>

      <footer className="mt-10 text-sm text-gray-600">
        💬 Join Telegram | 📧 support@finverg.com
      </footer>
    </div>
  );
}
