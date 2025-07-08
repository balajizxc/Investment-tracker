import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">Register on Finverg</h1>
      <p className="mb-6 text-lg text-gray-600">Create an account to start tracking your investments</p>

      <form className="flex flex-col gap-4 w-full max-w-sm">
        <input type="email" placeholder="Email" className="p-2 border rounded-md" />
        <input type="password" placeholder="Password" className="p-2 border rounded-md" />
        <input type="password" placeholder="Confirm Password" className="p-2 border rounded-md" />
        <button className="bg-black text-white p-2 rounded-md hover:bg-gray-800">Register</button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 underline">
          Login
        </Link>
      </p>
    </div>
  );
}
