"use client"; // Mark as a Client Component

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation"; // Import usePathname for client-side routing
import "./globals.css";
import Navbarmain from "src/components/Navbarmain";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current route's pathname
  const isHomePage = pathname === "/"; // Check if it's the home page

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] w-screen min-h-screen ${
          isHomePage ? "overflow-y-scroll" : "overflow-y-hidden"
        } scrollbar-hide`}
      >
        {/* Fixed Navbar */}
        <div className="top-0 z-10 fixed w-full">
          <Navbarmain />
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
