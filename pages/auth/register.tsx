import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setMessage("❌ Registration failed: " + signUpError?.message);
      return;
    }

    // ✅ Save to metadata (auth.users)
    await supabase.auth.updateUser({
      data: { phone, country, name },
    });

    // ✅ Save to custom `users` table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email,
        name,
        phone,
        country,
      },
    ]);

    if (insertError) {
      setMessage("❌ Error saving user data: " + insertError.message);
    } else {
      setMessage("✅ Registered! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex mb-3 space-x-2">
          <select
            className="w-1/3 p-2 border rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
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
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </form>

      <footer className="mt-10 py-4 text-center text-sm text-gray-600 border-t">
        <p>📞 Need help? Contact support or join our Telegram community.</p>
        <p>
          💬 <a href="https://t.me/finverg" target="_blank" className="text-blue-600 underline">Join Telegram</a> | 
          📧 <a href="mailto:support@finverg.com" className="text-blue-600 underline">support@finverg.com</a>
        </p>
      </footer>
    </div>
  );
}
