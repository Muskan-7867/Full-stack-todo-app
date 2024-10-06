"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const urlOtp = router.query.otp as string;
      console.log("OTP from URL:", urlOtp); // Add this for debugging
      if (urlOtp) {
        setOtp(urlOtp);
      }
    }
  }, [router.isReady, router.query.otp]);
  

  const handleVerify = async () => {
    if (!otp) {
      setMessage("Please enter the verification code.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/verifyemail?otp=${otp}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect the user to login page after successful verification
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        className="p-8 rounded-lg shadow-lg bg-white w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-center text-sky-600 mb-6">Verify Your Email</h1>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-gray-700 text-lg font-medium mb-2">
            Verification Code
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 border text-lg border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleVerify}
          className={`w-full bg-blue-500 text-white py-3 text-lg rounded hover:bg-blue-700 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        {message && <p className="mt-4 text-center text-red-500 text-lg">{message}</p>}
      </motion.div>
    </div>
  );
}
