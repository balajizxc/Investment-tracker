import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">Login to Finverg</h1>
      <p className="mb-6 text-lg text-gray-600">Access your secure investment dashboard</p>
      
      <form className="flex flex-col gap-4 w-full max-w-sm">
        <input type="email" placeholder="Email" className="p-2 border rounded-md" />
        <input type="password" placeholder="Password" className="p-2 border rounded-md" />
        <button className="bg-black text-white p-2 rounded-md hover:bg-gray-800">Login</button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500 underline">
          Register
        </Link>
      </p>
    </div>
  );
}
