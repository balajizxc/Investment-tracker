import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800">
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">Finverg</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
        </div>
      </header>

      <section className="text-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4"
        >
          Invest Smart. Track Returns. Grow Wealth.
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Finverg helps you track your investments across phases with daily gain projections.
          Secure. Transparent. Built for long-term success.
        </p>
        <div className="mt-8 space-x-4">
          <Link href="/auth/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Start Investing</Link>
          <Link href="/auth/login" className="px-6 py-2 border rounded text-blue-600 hover:border-blue-700">Login</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">🔒 Secure & Transparent</h3>
          <p className="text-sm text-gray-600">All transactions are stored safely via Supabase backend and audited regularly.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">📈 Smart Gains</h3>
          <p className="text-sm text-gray-600">Track your returns daily. Phased investment returns based on holding duration.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">⚙️ Easy to Use</h3>
          <p className="text-sm text-gray-600">Simple dashboard, secure UPI payments, and instant access to your portfolio.</p>
        </div>
      </section>

      <footer className="mt-20 py-6 text-center text-sm text-gray-500 border-t">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p className="mt-1">
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> |
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
