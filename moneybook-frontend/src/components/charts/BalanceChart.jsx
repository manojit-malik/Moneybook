import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BalanceChart({ summary }) {
  const data = [
    { name: "Balance", amount: summary.balance || 0 },
    { name: "Loan Taken", amount: summary.loanTaken || 0 },
    { name: "Loan Given", amount: summary.loanGiven || 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Financial Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            className="dark:stroke-gray-700" 
          />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
            className="text-sm"
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Bar 
            dataKey="amount" 
            fill="#3B82F6" 
            radius={[8, 8, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}