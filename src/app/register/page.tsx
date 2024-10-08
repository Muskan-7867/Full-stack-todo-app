"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { PulseLoader, HashLoader } from "react-spinners";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Page loading state

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!user.username || !user.email || !user.password) {
      return setMessage("Please fill in all fields.");
    }
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful! Please verify your email");
        // router.push("/login");
      } else {
        setMessage(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate page loading delay
    setTimeout(() => {
      setPageLoading(false); // Set page as loaded after delay
    }, 1000); // Adjust delay as needed
  }, []);

  // Show HashLoader while the page is loading
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-300">
        <HashLoader color="#36d7b7" size={30} />
      </div>
    );
  }

  return (
    <div className="flex justify-center md:justify-start items-center h-screen bg-gray-100 dark:bg-gray-300 px-4">
      <motion.div
        className="flex flex-col md:flex-row items-center w-full md:ml-[15%]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="p-8 m-6 rounded-lg shadow-lg bg-white w-full md:max-w-lg lg:max-w-xl"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-4xl font-bold text-sky-600 dark:text-sky-900 mb-6 text-center">Register</h1>
          {["username", "email", "password"].map((field) => (
            <div key={field} className="mb-4">
              <label htmlFor={field} className="block text-gray-700 text-[2em] md:text-[1.5em] font-medium mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={`Enter your ${field}`}
                value={user[field]}
                onChange={handleChange}
                className="w-full p-4 border text-[2em] md:text-[1.5em] border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <button
            onClick={handleRegister}
            className={`w-full bg-blue-500 dark:bg-sky-900 text-white py-3 text-[2em] md:text-[1.5em] rounded hover:bg-blue-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Register"}
          </button>
          {message && <p className="mt-4 text-center text-green-500 text-lg">{message}</p>}
          <p className="mt-6 text-center text-xl text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 dark:text-sky-900 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
        <motion.div
          className="hidden md:flex justify-center items-center md:ml-[10%] lg:ml-[15%]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/signup.svg" alt="Signup illustration" width={350} height={350} className="lg:w-[450px] lg:h-[450px]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
