import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
      setError("");
    } else {
      const data = await res.json();
      setError(data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        {sent ? (
          <p className="text-green-600">Password reset link sent to your email.</p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-2 border w-full"
              required
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
}
