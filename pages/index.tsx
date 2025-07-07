import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Finverg</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="text-blue-600 font-medium">Login</Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Invest Smart with Finverg</h2>
        <p className="text-lg mb-8">
          Finverg is your gateway to high-growth investments with transparent tracking, real-time analytics, and community-first support.
        </p>
        <Link href="/auth/register">
          <span className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition">
            Start Investing
          </span>
        </Link>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-xl font-semibold">📊 Transparent Returns</h3>
            <p className="text-sm mt-2">Track your daily gains with real-time dashboards and phase-based earnings.</p>
          </div>
          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-xl font-semibold">🔐 Secure Platform</h3>
            <p className="text-sm mt-2">Backed by Supabase, with secure authentication and encrypted data storage.</p>
          </div>
          <div className="bg-white shadow p-6 rounded">
            <h3 className="text-xl font-semibold">🤝 Community Support</h3>
            <p className="text-sm mt-2">Connect with other investors and get help directly on Telegram or email.</p>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 border-t text-sm text-gray-600">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
