"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PulseLoader, HashLoader } from "react-spinners";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Page loading state

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!user.email || !user.password)
      return setMessage("Please enter both email and password.");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok)
        return setMessage(data.error || "Login failed. Please try again.");
      if (!data.token) return setMessage("Your email is not verified.");

      Cookies.set("authToken", data.token, { expires: 7 });
      router.push("/");
      setMessage("Login successful!");
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate page loading delay
    setTimeout(() => {
      setPageLoading(false); // Set the page as loaded after a short delay
    }, 1000); // Adjust the delay as needed
  }, []);

  // If page is still loading, show the HashLoader
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-300">
        <HashLoader color="#36d7b7" size={30} />
      </div>
    );
  }

  // Main login page content after the page finishes loading
  return (
    <div className="flex justify-center md:justify-start items-center h-screen bg-gray-100 dark:bg-gray-300 px-4">
      <motion.div
        className="flex flex-col md:flex-row items-center w-full md:ml-[15%]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="p-8 m-6 rounded-lg shadow-lg bg-white w-full md:max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-4xl font-bold text-sky-600 dark:text-sky-900 mb-6 text-center">
            Login
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[2em] md:text-[1.5em] font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-4 border text-[2em] md:text-[1.5em] border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-[2em] md:text-[1.5em] font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-4 border text-[2em] md:text-[1.5em] border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleLogin}
            className={`w-full bg-blue-500 dark:bg-sky-900 text-white py-3 text-[2em] md:text-[1.5em] rounded hover:bg-blue-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Login"}
          </button>
          {message && (
            <p className="mt-4 text-center text-green-500 text-sm">{message}</p>
          )}
         <p className="mt-6 text-center text-gray-600 text-[2em] md:text-[1.5em]">
          Don't have an account?{" "}
            <Link
               href="/register"
              className="text-blue-600 dark:text-sky-900 hover:underline"
  >
    Register
  </Link>
</p>

        </motion.div>
        <motion.div
          className="hidden md:flex justify-center items-center md:ml-[10%] lg:ml-[15%]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/login.svg"
            alt="Login illustration"
            width={350}
            height={350}
            className="lg:w-[450px] lg:h-[450px]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
