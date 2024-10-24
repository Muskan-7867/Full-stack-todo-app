"use client";

import React, { Suspense, useState } from "react";
import Addtodo from "src/components/Addtodo";
import Navbar from "src/components/Navbar";
import Todos from "src/components/Todos";

const Home: React.FC = () => {
const [isRerenderTodos, setIsRerenderTodos ] = useState<boolean>(false)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen">
        <main className="mt-8 p-4 text-black">
          <Navbar  />
          <Addtodo setReRender={setIsRerenderTodos} />
          <Todos reRender={isRerenderTodos} />
        </main>
      </div>
    </Suspense>
  );
};

export default Home;
