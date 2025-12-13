"use client";

import { useState, useEffect } from "react";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
import Header from "../components/header/header_logged_in";
import EventWidget from "../event_page/event_widget";
import { API_URL } from "../api";

export default function SearchPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/get_event/all`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-white font-sans">
      <Header />
      <div style={{ height: '80px' }}></div>

      <div className="w-full flex flex-col items-center pt-10 pb-20">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md mb-4 p-2 border rounded-lg"
        />

        <main className="w-full flex flex-col items-center gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventWidget key={event.id} data={event} />
            ))
          ) : (
            <p>No events found</p>
          )}
        </main>
      </div>

      <BottomNavBar />
    </div>
  );
}
