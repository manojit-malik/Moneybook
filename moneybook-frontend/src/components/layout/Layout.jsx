import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* MOBILE HEADER */}
      <MobileHeader onMenuClick={() => setOpen(true)} />

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* MOBILE SIDEBAR OVERLAY */}
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl">
              <Sidebar onClose={() => setOpen(false)} />
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
