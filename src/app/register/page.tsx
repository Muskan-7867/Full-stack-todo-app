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
  const [pageLoading, setPageLoading] = useState(true); 

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

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
        setMessage("Registration successfull! ");
        router.push('/login');
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
    setTimeout(() => {
      setPageLoading(false); // Set page as loaded after delay
    }, 1000); // Adjust delay as needed
  }, []);

  // Show HashLoader while the page is loading
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center dark:bg-gray-900 h-screen">
        <HashLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center dark:bg-gray-900 min-h-screen">
      <div className="flex md:flex-row flex-col justify-center items-center gap-[25%] mb-[15%] px-4 md:px-8 w-full max-w-screen-lg">
        {/* Register Form */}
        <motion.div
          className="flex flex-col justify-center dark:bg-gray-800 shadow-lg m-6 mx-auto p-8 rounded-lg w-[100vh] max-w-[90vw] md:max-w-lg lg:max-w-2xl min-h-[500px]" // Adjusted max width
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 font-bold text-5xl text-center text-sky-600 md:text-4xl dark:text-sky-400">
            Register
          </h1>
          {["username", "email", "password"].map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block mb-2 font-medium text-3xl text-white dark:text-gray-300"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={`Enter your ${field}`}
                value={user[field]}
                onChange={handleChange}
                className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 border focus:border-blue-500 rounded-lg w-full text-2xl dark:text-white focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={handleRegister}
            className={`w-full bg-blue-500 dark:bg-sky-900 text-white py-3 text-2xl rounded-lg hover:bg-blue-700 dark:hover:bg-sky-700 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Register"}
          </button>
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message === "Registration successfull!"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <p className="mt-6 text-center text-lg text-white dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-sky-400 hover:underline"
            >
              Login
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
            src="/signup.svg"
            alt="Signup illustration"
            width={900}
            height={900}
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
