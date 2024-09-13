"use client";
import React, { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (user.email && user.password) {
      setIsLoading(true);
      setMessage("");

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.error || "Login failed. Please try again.");
          return;
        }

        const { token } = data;

        if (!token) {
          setMessage("Your email is not verified.");
          Cookies.remove("authToken");
          return;
        }

        setMessage("Login successful!");
        Cookies.set("authToken", token, {
          expires: 7,
        });
        router.push("/");
      } catch (error) {
        setMessage("An error occurred. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage("Please enter both email and password.");
    }
  };

  return (
    <div className="flex justify-center md:justify-start items-center h-screen bg-gray-50 px-4">
      {/* Main Container */}
      <motion.div
        className="flex flex-col md:flex-row items-center w-full md:ml-[15%]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Login Form Container */}
        <motion.div
          className="p-8 m-6 rounded-lg shadow-lg bg-white w-full md:max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-4xl font-bold text-gray-800 mb-6 text-center md:text-center">
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
              className="block text-gray-700 text-[2em] md:text-[1.5em] text-xl font-medium mb-2"
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
            className={`w-full bg-blue-600 text-white py-3 text-[2em] md:text-[1.5em] rounded hover:bg-blue-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {message && (
            <p className="mt-4 text-center text-green-500 text-sm">{message}</p>
          )}
          <p className="mt-6 text-center text-gray-600 text-[2em] md:text-[1.5em]">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>

        {/* SVG Image Container */}
        <motion.div
          className="hidden md:flex justify-center items-center md:ml-[10%] lg:ml-[15%]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/login.svg"
            alt="Login illustration"
            className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
