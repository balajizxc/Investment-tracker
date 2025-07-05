import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState(0);
  const [phase, setPhase] = useState("phase1");
  const [method, setMethod] = useState("upi");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage("");
    const { data: { user }, error: ue } = await supabase.auth.getUser();
    if (ue || !user) return setMessage("❌ Login to invest");

    const { error } = await supabase
      .from("user_investments")
      .insert([{ user_id: user.id, amount, phase, method, status: "pending" }]);
    if (error) {
      console.error(error);
      setMessage("❌ Submission failed");
    } else {
      setMessage("✅ Submitted — pending approval");
      setAmount(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields for amount, phase, method, submit*/}
      {message && <p>{message}</p>}
    </form>
  );
}
