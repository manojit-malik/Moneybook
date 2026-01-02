import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "../../api/transaction.api";
import { Link, useNavigate } from "react-router-dom";

/* ---------- HELPERS ---------- */
const isNegative = (type) =>
  type === "EXPENSE" ||
  type === "LOAN_GIVEN" ||
  type === "SETTLEMENT";

const getTextColor = (type) =>
  isNegative(type)
    ? "text-red-600 dark:text-red-400"
    : "text-green-600 dark:text-green-400";

const TRANSACTION_TYPES = [
  "ALL",
  "INCOME",
  "EXPENSE",
  "LOAN_TAKEN",
  "LOAN_GIVEN",
  "RECOVERY",
  "SETTLEMENT",
];

const today = new Date().toISOString().split("T")[0];

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATES */
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NONE"); // HIGH_LOW | LOW_HIGH
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ---------- FILTER + SORT LOGIC ---------- */
  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    /* TYPE FILTER */
    if (typeFilter !== "ALL") {
      data = data.filter((tx) => tx.type === typeFilter);
    }

    /* DATE RANGE FILTER */
    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter(
        (tx) => new Date(tx.transactionDate) >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // include full day
      data = data.filter(
        (tx) => new Date(tx.transactionDate) <= to
      );
    }

    /* SORT */
    if (sortOrder === "HIGH_LOW") {
      data.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === "LOW_HIGH") {
      data.sort((a, b) => a.amount - b.amount);
    } else {
      // DEFAULT: latest first
      data.sort(
        (a, b) =>
          new Date(b.transactionDate) -
          new Date(a.transactionDate)
      );
    }

    return data;
  }, [transactions, typeFilter, sortOrder, fromDate, toDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>

        <Link
          to="/transactions/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          + Add Transaction
        </Link>
      </div>

      {/* FILTER BAR */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-4 gap-4
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-xl p-4
        "
      >
        {/* TYPE */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
        >
          {TRANSACTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ")}
            </option>
          ))}
        </select>

        {/* SORT */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
        >
          <option value="NONE">Latest First</option>
          <option value="HIGH_LOW">Amount: High → Low</option>
          <option value="LOW_HIGH">Amount: Low → High</option>
        </select>

        {/* FROM DATE */}
<input
  type="date"
  value={fromDate}
  max={today}
  onChange={(e) => setFromDate(e.target.value)}
  className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
/>

{/* TO DATE */}
<input
  type="date"
  value={toDate}
  max={today}
  onChange={(e) => setToDate(e.target.value)}
  className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
/>

      </div>

      {/* LIST */}
      <div
        className="
          rounded-xl overflow-hidden
          border border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900
        "
      >
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="
                flex justify-between items-center
                px-5 py-4
                border-b border-gray-200 dark:border-gray-800
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors
              "
            >
              {/* LEFT */}
              <div>
                <p className={`font-semibold ${getTextColor(tx.type)}`}>
                  {tx.category}
                </p>

                <p className={`text-xs mt-1 ${getTextColor(tx.type)}`}>
                  {tx.type.replace("_", " ")}
                  {tx.counterparty && ` • ${tx.counterparty}`}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {new Date(tx.transactionDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${getTextColor(tx.type)}`}
                >
                  {isNegative(tx.type) ? "-" : "+"}₹
                  {tx.amount.toLocaleString("en-IN")}
                </p>

                <button
                  onClick={() =>
                    navigate(`/transactions/edit/${tx.id}`)
                  }
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
