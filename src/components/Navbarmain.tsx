"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie"; 
import { UserPlus, Lock } from "lucide-react";
import ThemeToggle from "./ThemeToggle"; 

const Navbarmain: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is authenticated by looking for the auth token
    const token = Cookies.get("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <nav className="bg-blue-400 dark:bg-sky-900 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-4xl font-bold">
          TodoApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile View: Show login icon only if not authenticated, register icon always */}
          <div className="flex items-center space-x-4 lg:hidden">
            {!isAuthenticated && (
              <Link href="/login" aria-label="Login">
                <Lock className="h-10 w-25 text-white hover:text-gray-300 transition-colors duration-200" />
              </Link>
            )}
            <Link href="/register" aria-label="Register">
              <UserPlus className="h-10 w-25 text-white hover:text-gray-300 transition-colors duration-200" />
            </Link>
          </div>

          {/* Desktop View: Show login button only if not authenticated, register button always */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {!isAuthenticated && (
              <Link href="/login">
                <button className="bg-white  dark:bg-gray-600 text-gray-700 dark:text-white text-xl px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  Login
                </button>
              </Link>
            )}
            <Link href="/register">
              <button className="bg-white text-black dark:bg-gray-600 text-xl  dark:text-white px-6 py-2 rounded-full  transition-colors duration-200">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbarmain;
