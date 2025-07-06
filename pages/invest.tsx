import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Invest() {
  const [amount, setAmount] = useState(0);
  const [phase, setPhase] = useState("phase1");
  const [method, setMethod] = useState("upi");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/auth/login");
    });
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const {
      data: { user },
      error: ue,
    } = await supabase.auth.getUser();
    if (ue || !user) {
      return setMessage("❌ Login to invest");
    }

    const amountToSubmit = parseFloat(amount.toString());
    if (isNaN(amountToSubmit) || amountToSubmit <= 0 || transactionId.trim() === "") {
      return setMessage("❌ Please fill in all required fields.");
    }

    const { error } = await supabase.from("user_investments").insert([
      {
        user_id: user.id,
        amount: amountToSubmit,
        phase,
        method,
        transaction_id: transactionId,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      setMessage("❌ Submission failed: " + error.message);
    } else {
      setMessage("✅ Investment submitted! Awaiting approval.");
      setAmount(0);
      setPhase("phase1");
      setMethod("upi");
      setTransactionId("");
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  };

  const renderPaymentDetails = () => {
    switch (method) {
      case "upi":
        return (
          <div className="bg-gray-100 p-3 rounded mb-4">
            <p><strong>UPI ID:</strong> balajizxc@kotak</p>
          </div>
        );
      case "bank":
        return (
          <div className="bg-gray-100 p-3 rounded mb-4">
            <p><strong>Account Number:</strong> 8750125837</p>
            <p><strong>IFSC Code:</strong> KKBK0008763</p>
            <p><strong>Bank:</strong> Kotak Mahindra Bank</p>
            <p><strong>Branch:</strong> Pollachi</p>
          </div>
        );
      case "card":
        return (
          <div className="bg-yellow-100 p-3 rounded mb-4 text-yellow-800">
            <p>Card payment instructions will be shared soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Make a New Investment</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="amount" className="block font-medium mb-2">Amount (₹):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phase" className="block font-medium mb-2">Investment Phase:</label>
          <select
            id="phase"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="method" className="block font-medium mb-2">Payment Method:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        {renderPaymentDetails()}

        <div className="mb-6">
          <label htmlFor="transactionId" className="block font-medium mb-2">Transaction ID:</label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Submit Investment
        </button>

        {message && (
          <p className={`mt-4 p-2 rounded text-sm ${message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
