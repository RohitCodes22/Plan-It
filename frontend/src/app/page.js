"use client";

import Image from "next/image";
import Header from "./components/header/header";
import { useEffect, useState } from "react";

function Home() {

}


export default function Home() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme"); // ✅ safe
    setTheme(savedTheme);
  }, []);
  
  return (
    <main className="min-h-screen flex flex-col bg-zinc-50 font-sans">
      <Header />

      <section className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Plan-IT</h1>
        <p className="text-lg text-zinc-700 max-w-xl mb-8">
          Finally Make Some Friends In Person!!!!!!!
        </p>

        <a
          href="/signup"
          className="px-6 py-3 rounded-xl border border-black hover:bg-gray-100 transition text-base"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}