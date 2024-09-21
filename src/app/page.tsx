"use client";  // Ensure this is at the top of the file

import React, { Suspense } from "react";
import Addtodo from "src/components/Addtodo";
import Navbar from "src/components/Navbar";
import Todos from "src/components/Todos";

const Home: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-300">
        <main className="p-4 mt-8 text-black">
          <Navbar />
          <Addtodo />
          <Todos />
        </main>
      </div>
    </Suspense>
  );
};

export default Home;
