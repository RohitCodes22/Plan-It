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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
    <div className="relative min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="h-20"></div>

      <div className="w-full flex flex-col items-center pt-6 pb-20 px-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-3 mb-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-red-500 mb-4 font-medium">{error}</p>
            )}

            {filteredEvents.length === 0 ? (
              <p className="text-gray-500">No events found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    <EventWidget
                      data={{
                        ...event,
                        tags: event.tags || [],
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
