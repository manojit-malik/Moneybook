import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../media/logo.png";
import logoutImg from "../../media/logout.png";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col">
      
      {/* MOBILE CLOSE */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden mb-4 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          ✕ Close
        </button>
      )}

      {/* LOGO */}
      <div className="flex items-center gap-2 mb-6">
        <img src={logo} alt="MoneyBook" className="h-10" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          MoneyBook
        </span>
      </div>

      {/* USER */}
      {user && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logged in as
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </p>
        </div>
      )}

      {/* NAV */}
      <nav className="flex-1 space-y-2">
        <Link
          to="/dashboard"
          onClick={onClose}
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/transactions"
          onClick={onClose}
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/transactions")
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Transactions
        </Link>

        <Link
          to="/transactions/add"
          onClick={onClose}
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/transactions/add")
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Add Transaction
        </Link>
      </nav>

      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="mt-4 mb-2 w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-semibold"
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* LOGOUT */}
      <button
        onClick={() => {
          logout();
          onClose?.();
        }}
        className="mt-2 flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
      >
        <img src={logoutImg} alt="Logout" className="h-5" />
        Logout
      </button>
    </aside>
  );
}
