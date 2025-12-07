"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EventFeed = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  // Get user's GPS location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported. Using fallback coords.");
      setLocation({ lat: 37.948544, lng: -91.77153 }); // Rolla, MO
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Location permission denied. Using fallback coords.");
        setLocation({ lat: 37.948544, lng: -91.77153 });
      }
    );
  };

  // Fetch feed once we have location
  const get_feed = async (lat, lng) => {
    try {
      const distance = 500000000; // 5 km
      const filters = [];

      const response = await fetch("http://localhost:80/events/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          max_distance: distance,
          filters: filters,
        }),
      });

      const data = await response.json();
      console.log(data);
      setEvents(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickEvent = (id) => {
    router.push(`/event_page/${id}`)
  }

  // Step 1: Get location
  useEffect(() => {
    getUserLocation();
  }, []);

  // Step 2: Once location exists, fetch events
  useEffect(() => {
    if (location) {
      get_feed(location.lat, location.lng);
    }
  }, [location]);

  return (
    <div className="w-full py-4">
      {loading && <p className="text-gray-500">Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className="text-gray-500">
          No events found. Maybe quit being a bum and make your own event.
        </p>
      )}

      {!loading && events.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full gap-15">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-[250px] bg-white border border-gray-400 shadow-md rounded-lg p-4 flex flex-col justify-center items-center w-[80%]"
            >
              <div className="w-full flex justify-start">
                <h5 className="font-semibold mb-2 underline">
                  {event.organizer_first} {event.organizer_last}
                </h5>
              </div>
              <h3 className="text-lg font-bold mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>

              <p className="text-sm text-gray-500 mb-2">
                Distance: {event.distance} m
              </p>

              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button onClick={() => handleClickEvent(event.id)} className="rounded-lg ">Check It Out!</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventFeed;
