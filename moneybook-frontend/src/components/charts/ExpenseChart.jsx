import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899", "#14B8A6"];

export default function ExpenseChart({ transactions }) {
  // Get expense data
  const expenseData = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((acc, tx) => {
      const found = acc.find((a) => a.name === tx.category);
      if (found) {
        found.value += tx.amount;
      } else {
        acc.push({ name: tx.category, value: tx.amount, type: "Expense" });
      }
      return acc;
    }, []);

  // Get loan given data grouped by person
  const loanGivenData = transactions
    .filter((tx) => tx.type === "LOAN_GIVEN")
    .reduce((acc, tx) => {
      const person = tx.counterparty || "Unknown";
      const found = acc.find((a) => a.name === person);
      if (found) {
        found.value += tx.amount;
      } else {
        acc.push({ name: person, value: tx.amount, type: "Loan Given" });
      }
      return acc;
    }, []);

  // Combine both datasets
  const combinedData = [...expenseData, ...loanGivenData];

  if (combinedData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Expense & Loan Breakdown
        </h3>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No expenses or loans yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Add transactions to see the breakdown
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Custom label to show percentage and amount
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 dark:bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{payload[0].name}</p>
          <p className="text-blue-400 text-sm">
            {payload[0].payload.type}
          </p>
          <p className="text-green-400 font-bold mt-1">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Expense & Loan Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={combinedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            label={renderCustomLabel}
          >
            {combinedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary below chart */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              ₹{expenseData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Total Loans Given</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              ₹{loanGivenData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}