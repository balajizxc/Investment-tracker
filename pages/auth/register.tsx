import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      if (error.message.includes("User already registered")) {
        setMessage("❌ Email already registered. Please login.");
      } else {
        setMessage("❌ " + error.message);
      }
    } else {
      setMessage("✅ Registration successful! Please check your email to confirm.");
      setTimeout(() => router.push("/auth/login"), 2500);
    }

    setLoading(false);
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
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p
            className={`text-center p-2 rounded ${
              message.startsWith("✅") ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
