"use client"
import React from "react";
import Image from "next/image";
import logo from "../header/Plan.png";
import { useRouter } from "next/navigation";
import { API_URL } from "../../api";
export default function Header() {
  const router = useRouter();
  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Logout failed");

      // Optional: redirect or clear frontend state
      router.push("/")
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <header className="fixed w-full shadow-md py-4 px-6 flex items-center justify-between bg-white text-black">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="App Logo" width={40} height={40} />
        <span className="text-xl font-bold">Plan-It!</span>
      </div>

      <nav className="flex items-center gap-4">
        <div
          onClick={logout}
          className="text-sm px-4 py-2 rounded-xl border cursor-pointer border-black hover:bg-gray-100 transition"
        >
          Sign Out
        </div>
      </nav>
    </header>
  );
}
