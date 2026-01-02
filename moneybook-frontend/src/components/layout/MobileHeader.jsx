import { useAuth } from "../../hooks/useAuth";
import logo from "../../media/logo.png";

export default function MobileHeader({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
      <button
        onClick={onMenuClick}
        className="text-2xl text-gray-700 dark:text-gray-300"
      >
        ☰
      </button>

      <div className="flex items-center gap-2">
        <img src={logo} alt="MoneyBook" className="h-7" />
        <span className="font-bold text-gray-900 dark:text-white">
          MoneyBook
        </span>
      </div>

      {user && (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user.firstName}
        </span>
      )}
    </div>
  );
}
