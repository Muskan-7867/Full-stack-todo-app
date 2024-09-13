"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Navbar = () => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const todosData: string | null = searchParams.get("todos");

  return (
    <nav className="flex flex-col md:flex-row md:space-x-4 mt-8 px-4 md:px-8 py-2 bg-white shadow-md">
      <Link href="/" className={`block md:inline ${!todosData ? 'font-bold' : ''} py-2 md:py-0`}>
        All
      </Link>
      <Link href="/?todos=active" className={`block  md:inline ${todosData === 'active' ? 'font-bold' : ''} py-2 md:py-0`}>
        Active
      </Link>
      <Link href="/?todos=completed" className={`block md:inline ${todosData === 'completed' ? 'font-bold' : ''} py-2 md:py-0`}>
        Completed
      </Link>
    </nav>
  );
};

export default Navbar;
