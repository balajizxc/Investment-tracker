// pages/auth/register.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage("❌ Registration failed: " + error.message);
    } else {
      // Save extra data to localStorage for now
      localStorage.setItem("pending_name", name);
      localStorage.setItem("pending_phone", phone);
      localStorage.setItem("pending_country", country);

      setMessage("✅ Please check your email to verify and login.");
      setTimeout(() => router.push("/auth/login"), 2500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          className="w-full border p-2 rounded"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex space-x-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-1/3 p-2 border rounded"
          >
            <option value="India">🇮🇳 +91 India</option>
            <option value="USA">🇺🇸 +1 USA</option>
            <option value="UK">🇬🇧 +44 UK</option>
            <option value="Singapore">🇸🇬 +65 Singapore</option>
          </select>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-2/3 p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
