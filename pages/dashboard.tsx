export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        <p className="mb-4">💰 Portfolio Value: <strong>$0.00</strong></p>
        <p className="mb-4">📈 Gains: <strong>+0%</strong></p>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">🧾 Recent Activity:</h2>
          <p className="text-gray-600">None</p>
        </div>
      </div>
    </div>
  );
}
