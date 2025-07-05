// pages/auth/register.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Registration successful. Check your email to verify.");
      setEmail("");
      setPassword("");
      setName("");
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 border w-full" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 border w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 border w-full" required />
        <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">Register</button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
