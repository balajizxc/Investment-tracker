import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>📈 Investment Tracker</h1>
      <p>Track your portfolio securely</p>
      <Link href="/dashboard">
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}
