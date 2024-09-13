"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
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

  const handleRegister = async () => {
    if (user.username && user.email && user.password) {
      setIsLoading(true);
      setMessage("");

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Registration successful! You can now log in.");
          router.push("/login");
        } else {
          setMessage(data.error || "Registration failed. Please try again.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <div className="flex justify-center md:justify-start items-center h-screen bg-gray-50 px-4">
      <motion.div
        className="flex flex-col md:flex-row items-center w-full md:ml-[15%]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Registration Form Container */}
        <motion.div
          className="bg-white p-10 m-6 rounded-lg shadow-lg w-full md:max-w-lg lg:max-w-xl"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-4xl font-bold text-gray-800 mb-6 text-center md:text-center">
            Register
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[2em] md:text-[1.5em] font-medium mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={user.username}
              onChange={handleChange}
              className="w-full p-4 border text-[2em] md:text-[1.5em] border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
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
              className="block text-gray-700 text-2xl md:text-xl font-medium mb-2"
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
              className="w-full p-4 border  text-[2em] md:text-[1.5em] border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleRegister}
            className={`w-full bg-blue-500 text-[2em] md:text-[1.5em] text-white py-4 rounded hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {message && (
            <p className="mt-4 text-center text-green-500 text-lg">{message}</p>
          )}
          <p className="mt-6 text-center text-[2em] md:text-[1.5em] text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>

        {/* SVG Image Container */}
        <div className="hidden md:flex justify-center items-center md:ml-[10%] lg:ml-[20%]">
          <motion.img
            src="/signup.svg"
            alt="Register illustration"
            className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
