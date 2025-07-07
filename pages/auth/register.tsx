// pages/auth/register.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
        },
      },
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Registration successful! Check your email.");
      setTimeout(() => router.push("/auth/login"), 2500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (optional)"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        {message && (
          <p className={`p-2 text-center ${message.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
