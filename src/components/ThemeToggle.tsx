"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; 

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // On mount, check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // If no saved theme, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  const applyTheme = (currentTheme: string) => {
    const root = document.documentElement; // <html> element
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full hover:bg-sky-700 transition-colors duration-200"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="h-10 w-25 text-white" />
      ) : (
        <Sun className="h-10 w-25 text-white" />
      )}
    </button>
  );
};

export default ThemeToggle;
