import React from "react";
import Image from "next/image";
import logo from "./Plan.png"

export default function Header() {
  return (
    <header className="w-full shadow-md py-4 px-6 flex items-center justify-between bg-white text-black">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="App Logo" width={40} height={40} />
        <span className="text-xl font-bold">Plan-It!</span>
      </div>

      <nav className="flex items-center gap-4">
        <a href="/login" className="text-sm hover:underline">
          Login
        </a>
        <a
          href="/signup"
          className="text-sm px-4 py-2 rounded-xl border border-black hover:bg-gray-100 transition"
        >
          Sign Up
        </a>
      </nav>
    </header>
  );
}
