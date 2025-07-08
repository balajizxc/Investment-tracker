import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">Login to Finverg</h1>
      <p className="mb-6 text-lg text-gray-600">Access your secure investment dashboard</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-500 underline">
          Register
        </Link>
      </p>
    </div>
  );
}
