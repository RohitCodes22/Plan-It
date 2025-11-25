"use client";
import { useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";

export default function LogInWidget() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // if you add passwords later
  const [message, setMessage] = useState("");

  console.log('my url', API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      console.log('my url', API_URL)
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // VERY IMPORTANT for Flask session cookies
        body: JSON.stringify({
          username: username,
          password: password, // ignored by backend unless implemented
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setMessage("Login successful!");
      router.push('/home')
    } catch (err) {
      console.error("Login error:", err);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-sm text-gray-600">Welcome back! Please sign in.</p>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full border rounded-md py-2 mt-2 hover:bg-gray-100 transition font-medium"
          type="submit"
        >
          Log In
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
      )}
    </div>
  );
}
