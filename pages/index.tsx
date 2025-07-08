import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Welcome to Finverg</title>
      </Head>

      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 py-10 min-h-screen">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to <span className="text-purple-400">Finverg</span></h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-10">
            Securely invest, track returns by investment phase, and grow your wealth smarter with analytics-driven insights.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg shadow-lg text-lg">Login</button>
            </Link>
            <Link href="/register">
              <button className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg shadow-lg text-lg">Register</button>
            </Link>
            <button
              onClick={handleArbitrageClick}
              className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg shadow-lg text-lg"
            >
              Arbitrage
            </button>
          </div>

          <div className="text-sm opacity-80">
            💬 <a href="https://t.me/finverg" className="underline">Join Telegram</a> | 📧 support@finverg.com
          </div>
        </div>
      </div>
    </>
  );
}
