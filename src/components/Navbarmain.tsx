"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserPlus, Lock, LogOut } from "lucide-react"; 
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";

interface NavbarmainProps {
  onLogin?: () => void;
}

const Navbarmain: React.FC<NavbarmainProps> = ({ onLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check for the auth token and update authentication state
    const token = Cookies.get("authToken");
    setIsAuthenticated(!!token); 
  }, []);

  const handleLogout = () => {
    Cookies.remove("authToken");
    localStorage.removeItem("todos_synced"); // Clear the synced flag on logout
    setIsAuthenticated(false);  // Update state immediately
    router.push("/login");
  };

  // Placeholder function for login; replace with actual login logic
  const handleLogin = () => {
    Cookies.set("authToken", "your_token_here");  // Set token on actual login
    setIsAuthenticated(true);  // Update state immediately after login
    router.push("/");  // Redirect after successful login
    if (onLogin) {
      onLogin(); 
    }
  };

  return (
    <nav className="bg-white dark:bg-sky-900 p-4 w-full">
      <div className="flex justify-between items-center mx-auto container">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-4xl text-slate-800">
            TodoApp
          </Link>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <ThemeToggle />
        
          <div className="flex items-center space-x-4 lg:hidden">
            {!isAuthenticated ? (
              <>
                <Link href="/login" aria-label="Login">
                  <Lock className="w-25 h-10 text-slate-800 hover:text-gray-300 transition-colors duration-200" />
                </Link>
                <Link href="/register" aria-label="Register">
                  <UserPlus className="w-25 h-10 text-slate-800 hover:text-gray-300 transition-colors duration-200" />
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} aria-label="Logout">
                <LogOut className="w-25 h-10 text-slate-800 hover:text-gray-300 transition-colors duration-200" />
              </button>
            )}
          </div>
        
          <div className="lg:flex lg:items-center lg:space-x-4 hidden">  
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <button className="bg-slate-800 hover:bg-white dark:hover:bg-gray-600 dark:bg-gray-600 px-6 py-2 rounded-[5px] text-white text-xl hover:text-slate-800 dark:text-white transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-slate-800 hover:bg-white dark:bg-gray-600 px-6 py-2 rounded-[5px] text-white text-xl hover:text-slate-800 dark:text-white transition-colors duration-200">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout}
                className="bg-slate-800 hover:bg-white dark:bg-gray-600 px-4 py-3 rounded-[5px] text-2xl text-white hover:text-slate-800 dark:text-white transition-colors duration-200">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbarmain;
