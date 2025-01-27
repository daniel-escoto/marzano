"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";

  return (
    <header className="fixed left-0 right-0 top-0 bg-white shadow-sm dark:border-b dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Marzano
        </Link>
        <Link
          href="/settings"
          className={`rounded-md px-3 py-1 text-sm transition-colors ${
            isSettingsPage
              ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Settings
        </Link>
      </div>
    </header>
  );
}

export default Header;
