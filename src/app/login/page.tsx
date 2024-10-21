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
    if (!user.email || !user.password) {
      setMessage("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Login failed. Please try again.");
        return;
      }
      if (!data.token) {
        setMessage("Your email is not verified.");
        return;
      }

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
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#36d7b7" size={50}  />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center dark:bg-gray-900 min-h-screen">
      <div className="flex md:flex-row flex-col justify-center items-center gap-[25%] mb-[20%] px-4 md:px-8 w-full max-w-screen-lg">
        {/* Login Form */}
        <motion.div
          className="flex flex-col justify-center dark:bg-gray-800 shadow-lg m-6 mx-auto p-8 rounded-lg w-[100vh] max-w-[100vw] md:max-w-lg lg:max-w-2xl min-h-[500px]" // Adjusted max width
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 font-bold text-5xl text-center text-sky-600 md:text-4xl dark:text-sky-400">
            Login
          </h1>
          <div className="mb-4">
            <label
              className="block mb-2 font-medium text-3xl text-white dark:text-gray-300"
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
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 border focus:border-blue-500 rounded-lg w-full text-2xl dark:text-white focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 font-medium text-3xl text-white dark:text-gray-300"
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
              className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 border focus:border-blue-500 rounded-lg w-full text-2xl dark:text-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleLogin}
            className={`w-full bg-blue-500 dark:bg-sky-900 text-white py-3 text-2xl rounded-lg hover:bg-blue-700 dark:hover:bg-sky-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Login"}
          </button>
          {message && (
            <p
              className={`mt-4 text-center text-md ${
                message === "Login successful!"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <p className="mt-6 text-center text-lg text-white dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 dark:text-sky-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>

        {/* Image section */}
        <motion.div
          className="md:flex justify-center items-center hidden md:ml-6 md:w-1/2 lg:w-1/3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/login.svg"
            alt="Login illustration"
            width={800}
            height={800}
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
