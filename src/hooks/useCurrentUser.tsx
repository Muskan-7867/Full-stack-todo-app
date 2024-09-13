"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useCurrentUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("authToken");

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify the token and user status by calling the backend endpoint
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        // Check the response to determine user authentication and verification status
        if (response.ok) {
          setUser({ email: data.email });
          setIsAuthenticated(true);
          setIsVerified(data.isVerified); // Set the verification status
        } else {
          setIsAuthenticated(false);
          Cookies.remove("authToken"); // Remove the token if verification fails
        }
      } catch (error) {
        console.error("Verification request failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return { isAuthenticated, user, loading, isVerified };
};
