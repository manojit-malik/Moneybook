import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addTransaction,
  getTransactionTypes,
} from "../../api/transaction.api";

export default function AddTransaction() {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    counterparty: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    getTransactionTypes()
      .then(setTypes)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const needsCounterparty =
    form.type === "LOAN_TAKEN" ||
    form.type === "LOAN_GIVEN" ||
    form.type === "RECOVERY" ||
    form.type === "SETTLEMENT";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type) {
      alert("Please select a transaction type");
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        ...form,
        amount: Number(form.amount),
      });
      alert("Transaction added successfully!");
      navigate("/transactions");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const Required = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Add Transaction
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TRANSACTION TYPE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Transaction Type <Required />
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                !form.type
                  ? "border-red-400"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800`}
            >
              <option value="" disabled>
                Select transaction type
              </option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <Required />
            </label>
            <input
              name="category"
              type="text"
              required
              value={form.category}
              onChange={handleChange}
              placeholder="e.g., Salary, Food, Rent"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (₹) <Required />
            </label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          {/* COUNTERPARTY */}
          {needsCounterparty && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Person Name <Required />
              </label>
              <input
                name="counterparty"
                type="text"
                required
                value={form.counterparty}
                onChange={handleChange}
                placeholder="Enter person's name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          )}

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date <Required />
            </label>
            <input
              name="transactionDate"
              type="date"
              required
              value={form.transactionDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
