"use client";
import { useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [age, setAge] = useState(0);

  console.log('my url', API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault(); 

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
        setMessage(data.message || "Sign Up failed");
        return;
      }

      setMessage("Sign Up successful!");
      router.push('/home')
    } catch (err) {
      console.error("Sign Up error:", err);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-sm text-gray-600">Welcome! Please create an account.</p>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="name"
            name="name"
          />
        </div>
        <div className="flex flex-col gap-2">
            <label>Date of Birth</label>
            <input
                type="date"
                className="border p-2 rounded"
            />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium">
            Set Username
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
            Set Password
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
          Sign Up
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
      )}
    </div>
  );
}
