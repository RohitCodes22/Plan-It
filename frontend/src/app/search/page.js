"use client";

import { useState, useEffect } from "react";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
import Header from "../components/header/header_logged_in";
import EventWidget from "../event_page/event_widget";
import { API_URL } from "../api";

export default function SearchPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/get_event/all`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const safeData = data.map((event) => ({
          id: event.id,
          name: event.name || "Untitled Event",
          tags: event.tags || [],
          ...event,
        }));

        setEvents(safeData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Showing sample data.");

        setEvents([
          { id: 1, name: "Sample Event 1", tags: ["sample", "test"] },
          { id: 2, name: "Sample Event 2", tags: ["mock", "demo"] },
        ]);
      } finally {
        setLoading(false);
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

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <main className="w-full flex flex-col items-center gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventWidget
                    key={event.id}
                    data={{
                      ...event,
                      tags: event.tags || [], 
                    }}
                  />
                ))
              ) : (
                <p>No events found</p>
              )}
            </main>
          </>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
