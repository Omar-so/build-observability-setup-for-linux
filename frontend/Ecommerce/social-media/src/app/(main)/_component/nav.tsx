"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { House, UserCircle, Bookmark, Search, Moon, Sun } from "lucide-react";
import { useSearchQuery } from "@/hooks/query/search";
import { useTheme } from "next-themes";

export default function Nav() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSearchQuery(search);
  const { theme, setTheme } = useTheme(); // ✅ fixed variable name (was settheme)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 dark:text-gray-100 shadow-sm transition-colors duration-300">
      <nav className="flex items-center justify-between p-4 md:px-8">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">
            Social App
          </h1>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <House size={22} />
            <span>Home</span>
          </Link>

          {user && (
            <Link
              href={`/profile/${user.id}`}
              className="flex items-center gap-2 p-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <UserCircle size={22} />
              <span>Profile</span>
            </Link>
          )}

          <Link
            href="/bookmark"
            className="flex items-center gap-2 p-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Bookmark size={22} />
            <span>Bookmarks</span>
          </Link>
        </div>

        {/* Right Section: Search + User Button + Theme Toggle */}
        <div className="relative flex items-center gap-4">
          {/* Search Box */}
          <div className="hidden sm:block w-48 md:w-64 relative">
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full focus:outline-none bg-transparent"
              />
            </div>

            {/* Search Suggestions */}
            {search && data?.data?.length > 0 && (
              <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 z-50 max-h-60 overflow-y-auto">
                {data.data.map((u: any) => (
                  <Link
                    key={u.id}
                    href={`/profile/${u.id}`}
                    onClick={() => setSearch("")}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <img
                      src={u.image || "/default-avatar.png"}
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{u.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {search && !isLoading && data?.data?.length === 0 && (
              <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 p-3 text-sm text-gray-500">
                No users found
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Button */}
          <div className="w-10 h-10 md:w-12 md:h-12">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-full h-full",
                },
              }}
            />
          </div>
        </div>
      </nav>

      {/* Mobile layout */}
      <div className="flex md:hidden justify-around items-center py-3 border-t bg-white dark:bg-gray-900 dark:border-gray-700">
        <Link href="/" className="flex flex-col items-center text-sm">
          <House size={22} />
          <span>Home</span>
        </Link>

        {user && (
          <Link
            href={`/profile/${user.id}`}
            className="flex flex-col items-center text-sm"
          >
            <UserCircle size={22} />
            <span>Profile</span>
          </Link>
        )}

        <Link href="/bookmark" className="flex flex-col items-center text-sm">
          <Bookmark size={22} />
          <span>Bookmarks</span>
        </Link>

        {/* Mobile Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center text-sm"
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
