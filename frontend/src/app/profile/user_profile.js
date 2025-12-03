"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { EventView } from "../components/eventView/eventView";

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState("attending"); // "attending" | "organizing"
  const [events, setEvents] = useState([]);
  const [dataForProfile, setDataForProfile] = useState({
    fname: "na",
    lname: "na",
    email: "na",
    username: "na",
    bio: "",
  });

  // -------------------------
  // Fetch user profile
  // -------------------------
  const get_user_data = async () => {
    try {
      const response = await fetch(`${API_URL}/get_user_info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const dfp = await response.json();

      dfp.bio =
        "This is my bio\nI worked very hard on it.\nI like to play games and go to bday parties :).";

      setDataForProfile(dfp);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // -------------------------
  // Fetch events for user
  // -------------------------
  const get_events = async () => {
    try {
      const response = await fetch(`${API_URL}/user/get_user_events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const events = await response.json();
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    get_user_data();
    get_events();
  }, []);

  // -------------------------
  // Filter events
  // -------------------------
  const attendingEvents = events.filter(
    (event) => event.organizer_username !== dataForProfile.username
  );

  const organizingEvents = events.filter(
    (event) => event.organizer_username === dataForProfile.username
  );

  const eventsToShow =
    viewMode === "attending" ? attendingEvents : organizingEvents;

  // -------------------------
  // UI Components
  // -------------------------
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      {/* ------- Profile Header ------- */}
      <header className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold">
          {dataForProfile.fname} {dataForProfile.lname}
        </h1>

        <div className="flex flex-col">
          <span className="text-gray-700 font-medium">
            @{dataForProfile.username}
          </span>

          <pre className="whitespace-pre-wrap text-gray-800 mt-2">
            {dataForProfile.bio}
          </pre>
        </div>
      </header>

      {/* ------- Toggle Buttons ------- */}
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode("attending")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "attending"
              ? "bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Attending
        </button>

        <button
          onClick={() => setViewMode("organizing")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "organizing"
              ? "bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Organizing
        </button>
      </div>

      {/* ------- Event View Section ------- */}
      <main className="w-full">
        <EventView events={eventsToShow} />
      </main>
    </div>
  );
}
