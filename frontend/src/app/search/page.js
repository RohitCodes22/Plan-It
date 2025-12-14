"use client";

import { useState, useEffect } from "react";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
import Header from "../components/header/header_logged_in";
import { API_URL } from "../api";
import UserTag from "../components/userTag/UserTag";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleClickEvent = (id) => {
    router.push(`/event/${id}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/get_event/all`);
        if (!response.ok) throw new Error("Failed to fetch events");
        setEvents(await response.json());
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-20" />

      {/* SEARCH HEADER */}
      <section className="max-w-7xl mx-auto px-10 pt-10 pb-6">
        <h1 className="text-4xl font-bold mb-6">Explore Events</h1>

        <input
          type="text"
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full
            max-w-2xl
            px-5
            py-4
            text-lg
            border
            border-gray-300
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-black
          "
        />
      </section>

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-10 pb-32">
        {loading && (
          <div className="py-20 text-center text-gray-500 text-lg">
            Loading events…
          </div>
        )}

        {error && <p className="text-red-500 font-medium py-10">{error}</p>}

        {!loading && filteredEvents.length === 0 && (
          <p className="text-gray-500 py-20 text-lg">
            No events match your search.
          </p>
        )}

        <div className="divide-y">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="
                grid
                grid-cols-[260px_1fr_200px]
                gap-10
                py-10
                items-center
              "
            >
              {/* IMAGE */}
              <div className="w-[260px] h-[160px] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={`${API_URL}/event/picture/${event.id}`}
                  alt={event.name}
                  width={260}
                  height={160}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>

              {/* INFO */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Organized by</span>
                  <UserTag
                    displayname={`${event.organizer_first} ${event.organizer_last}`}
                    user_id={event.organizer_id}
                    css="font-medium underline"
                  />
                  {event.distance !== undefined && (
                    <span>• {event.distance} m away</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleClickEvent(event.id)}
                  className="
                    px-6
                    py-3
                    text-lg
                    font-semibold
                    rounded-xl
                    bg-black
                    text-white
                    hover:bg-gray-900
                    transition
                  "
                >
                  View Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNavBar />
    </div>
  );
}
