export default function Topbar({ toggle }) {
  return (
    <header
      className="
        fixed top-0 left-0 right-0 h-16 z-30
        bg-white dark:bg-slate-900
        border-b border-slate-200 dark:border-slate-800
        flex items-center px-4 lg:ml-64
      "
    >
      <button
        onClick={toggle}
        className="
          lg:hidden mr-4 p-2 rounded
          bg-slate-200 dark:bg-slate-800
        "
      >
        ☰
      </button>

      <h3 className="text-xl font-bold">
        💼 MoneyBook
      </h3>
    </header>
  );
}
