"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface User {
  name: string;
  email: string;
  userId: string;
}

export const useCurrentUser = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    userId: "",
  });
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

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
        setUser({ name: data?.user.username, email: data?.user.email, userId: data?.user._id }); // Set the user data
        setIsAuthenticated(true);
        setIsVerified(data.isVerified); // Set the verification status
      } else {
        setIsAuthenticated(false);
        Cookies.remove("authToken"); // Remove the token if verification fails  nice move
      }
    } catch (error) {
      console.error("Verification request failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    verifyUser();
  }, []);

  return { isAuthenticated, user, loading, isVerified };
};
