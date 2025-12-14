"use client";
import { useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState(false);

  console.log('my url', API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      console.log('my url', API_URL)
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          fname: firstName,
          lname: lastName,
          email: email,
          username: username,
          password: password, 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessage(data.message || "Sign Up failed");
        return;
      }

    await fetch(`${API_URL}/notificatons/new_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        username: username,
      }),
    });

      setMessage("Sign Up successful!");
      setPopup(true);
      setTimeout(() => {
        router.push('/login')
      }, 2000);

    } catch (err) {
      console.error("Sign Up error:", err);
      setMessage("All fields are not filled correctly.");
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
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Sign Up Successful!</h2>
            <p className="text-gray-700">Please enter your new credentials to login!</p>
          </div>
        </div>
      )}

      <center>
        <p className="text-sm text-gray-600">If you already have an account, <a href="/login" className="text-blue-600 hover:underline">Log In</a></p>
      </center>

      {message && (
        <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
      )}
    </div>
  );
}
