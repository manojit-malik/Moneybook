import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTransactionById,
  updateTransaction,
} from "../../api/transaction.api";

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactionById(id)
      .then(setForm)
      .catch(() => alert("Transaction not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !form) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const needsCounterparty =
    ["LOAN_TAKEN", "LOAN_GIVEN", "RECOVERY", "SETTLEMENT"].includes(form.type);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateTransaction(id, {
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      counterparty: form.counterparty,
      transactionDate: form.transactionDate,
    });

    navigate("/transactions");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        {needsCounterparty && (
          <input
            name="counterparty"
            value={form.counterparty || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        )}

        <input
          type="date"
          name="transactionDate"
          value={form.transactionDate}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <div className="flex gap-4">
          <button
  type="button"
  onClick={() => navigate("/transactions")}
  className="
    flex-1 py-3 rounded-lg font-semibold
    bg-gray-200 text-gray-800
    hover:bg-gray-300
    dark:bg-gray-700 dark:text-gray-200
    dark:hover:bg-gray-600
    transition
  "
>
  Cancel
</button>

          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
