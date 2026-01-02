import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {user && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Welcome,&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </span>
        </div>
      )}
    </div>
  );
}
