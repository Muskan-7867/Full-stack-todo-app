"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserPlus, Lock, LogOut, Home } from "lucide-react"; 
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";

const Navbarmain: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("authToken");
      setIsAuthenticated(!!token); 
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-400 dark:bg-sky-900 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-4xl font-bold">
            {" "}TodoApp
          </Link>
        </div>
         <div className="flex items-center space-x-4 lg:space-x-8">
          {" "}
         <ThemeToggle />
        
        <div className="flex items-center space-x-4 lg:hidden">
            {!isAuthenticated ? (
              <>
                <Link href="/login" aria-label="Login">
                  <Lock className="h-10 w-25 text-white  hover:text-gray-300 transition-colors duration-200" />
                </Link>
                <Link href="/register" aria-label="Register">
                  <UserPlus className="h-10 w-25 text-white hover:text-gray-300 transition-colors duration-200" />
                </Link>
                </>
            ) : (<button onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-10 w-25 text-white hover:text-gray-300 transition-colors duration-200" />
              </button>
            )}
          </div>
        
          <div className="hidden lg:flex lg:items-center lg:space-x-4">  {/* Desktop View */}
           
{!isAuthenticated ? (  // Show buttons based on auth status 
              <>
          
                <Link href="/login">
                  <button className="bg-white dark:bg-gray-600 text-black dark:text-white text-2xl px-4 py-3 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <Lock className="inline-block mr-2  h-6 w-10" />Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-white text-black dark:bg-gray-600 text-2xl dark:text-white px-4 py-3 rounded-[5px] transition-colors duration-200">
                    <UserPlus className="inline-block mr-2 h-6 w-10" />
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button onClick={handleLogout}
                  className="bg-white text-black dark:bg-gray-600 text-2xl dark:text-white px-4 py-3 rounded-[5px] transition-colors duration-200">
                  <LogOut className="inline-block mr-2 h-6 w-10" />Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );};
  export default Navbarmain;
