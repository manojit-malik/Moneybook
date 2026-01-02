import { useEffect, useState } from "react";
import { getDashboardSummary, getTransactions } from "../../api/transaction.api";
import { Link } from "react-router-dom";
import BalanceChart from "../../components/charts/BalanceChart";
import ExpenseChart from "../../components/charts/ExpenseChart";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    balance: 0,
    loanTaken: 0,
    loanGiven: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, transactionsData] = await Promise.all([
          getDashboardSummary(),
          getTransactions(),
        ]);

        let calculatedSummary = {
          balance: 0,
          loanTaken: 0,
          loanGiven: 0,
        };

        if (Array.isArray(transactionsData)) {
          transactionsData.forEach((tx) => {
            const amount = Number(tx.amount) || 0;

            switch (tx.type) {
              case "INCOME":
                calculatedSummary.balance += amount;
                break;
              case "EXPENSE":
                calculatedSummary.balance -= amount;
                break;
              case "LOAN_TAKEN":
                calculatedSummary.balance += amount;
                calculatedSummary.loanTaken += amount;
                break;
              case "LOAN_GIVEN":
                calculatedSummary.balance -= amount;
                calculatedSummary.loanGiven += amount;
                break;
              case "RECOVERY":
                calculatedSummary.balance += amount;
                calculatedSummary.loanGiven -= amount;
                break;
              default:
                break;
            }
          });
        }

        setSummary({
          balance: summaryData?.balance ?? calculatedSummary.balance,
          loanTaken: summaryData?.loanTaken ?? calculatedSummary.loanTaken,
          loanGiven: summaryData?.loanGiven ?? calculatedSummary.loanGiven,
        });

        setTransactions(transactionsData || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading dashboard</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <p className="text-sm opacity-80">Total Balance</p>
          <h3 className="text-3xl font-bold">
            ₹ {summary.balance.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <p className="text-sm opacity-80">Loan Taken</p>
          <h3 className="text-3xl font-bold">
            ₹ {summary.loanTaken.toLocaleString("en-IN")}
          </h3>
        </div>

        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
          <p className="text-sm opacity-80">Loan Given</p>
          <h3 className="text-3xl font-bold">
            ₹ {summary.loanGiven.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart summary={summary} />
        <ExpenseChart transactions={transactions} />
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <Link
            to="/transactions"
            className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-2">
            {[...transactions]
              .sort(
                (a, b) =>
                  new Date(b.transactionDate) -
                  new Date(a.transactionDate)
              )
              .slice(0, 5)
              .map((tx) => {
                const isNegative =
                  tx.type === "EXPENSE" || tx.type === "LOAN_GIVEN";

                return (
                  <div
                    key={tx.id}
                    className="
                      flex justify-between items-center px-4 py-3
                      rounded-lg
                      bg-gray-50 dark:bg-gray-800
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors
                    "
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {tx.category}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
                          {tx.type.replace("_", " ")}
                        </span>

                        {tx.counterparty && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            • {tx.counterparty}
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-lg font-bold ${
                        isNegative
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {isNegative ? "-" : "+"}₹
                      {tx.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
