"use client";  

import React, { Suspense } from "react";
import Addtodo from "src/components/Addtodo";
import Navbar from "src/components/Navbar";
import Todos from "src/components/Todos";

const Home: React.FC = () => {

  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen">
        <main className="mt-8 p-4 text-black">
          <Navbar />
          <Addtodo />
          <Todos />
        </main>
      </div>
    </Suspense>
  );
};

export default Home;
