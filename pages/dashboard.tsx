import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSessionFromStorage = () => {
      const token = localStorage.getItem("user_email");
      if (!token) {
        router.push("/auth/login");
      } else {
        setUserEmail(token);
      }
    };

    getSessionFromStorage();
  }, [router]);

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        <p className="mb-2 text-sm text-gray-500">
          Logged in as: <span className="font-semibold">{userEmail}</span>
        </p>

        <div className="border-t mt-4 pt-4">
          <p className="mb-1">💰 <strong>Portfolio Value:</strong> $0.00</p>
          <p className="mb-1">📈 <strong>Gains:</strong> +0%</p>
          <p className="mb-1">🧾 <strong>Recent Activity:</strong> None</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user_email");
            router.push("/auth/login");
          }}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
