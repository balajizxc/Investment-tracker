import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user_email", email);
      router.push("/dashboard");
    } else {
      setError(data?.error_description || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border w-full"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border w-full"
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          New user?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:underline"
          >
            Register here
          </a>
        </p>

        <p className="mt-2 text-sm text-center">
          <a
            href="/auth/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot your password?
          </a>
        </p>
      </form>
    </div>
  );
}
