"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../api";
import Image from "next/image";
import UserTag from "../userTag/UserTag";

const EventFeed = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ lat: 37.948544, lng: -91.77153 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ lat: 37.948544, lng: -91.77153 });
      }
    );
  };

  const get_feed = async (lat, lng) => {
    try {
      const response = await fetch("http://localhost:80/events/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          max_distance: 500000000,
          filters: [],
        }),
      });

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickEvent = (id) => {
    router.push(`/event_page/${id}`);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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
        <div className="flex flex-col items-center justify-center w-full gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-[250px] bg-white border border-gray-300 shadow-md rounded-xl p-5 flex flex-col items-center w-[80%]"
            >
              <div className="w-full flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={`${API_URL}/profile/picture/${event.organizer_id}`}
                    alt="Profile picture"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>

                <UserTag
                  displayname={`${event.organizer_first} ${event.organizer_last}`}
                  css={"font-semibold underline"}
                  user_id={event.organizer_id}
                />
              </div>

              <h3 className="text-lg font-bold mt-2">{event.name}</h3>
              <p className="text-gray-600 text-center mt-1">
                {event.description}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Distance: {event.distance} m
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-[300px] h-[300px] overflow-hidden flex items-center justify-center">
                <Image
                  src={`${API_URL}/event/picture/${event.id}`}
                  alt="Event image"
                  width={300}
                  height={300}
                  className="object-cover w-[300px] h-[300px]"
                  unoptimized
                />
              </div>

              <button
                onClick={() => handleClickEvent(event.id)}
                className="
                  mt-4
                  px-6
                  py-2
                  rounded-full
                  bg-blue-500
                  text-white
                  font-semibold
                  shadow-md
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:bg-blue-600
                  hover:shadow-lg
                  active:scale-95
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  focus:ring-offset-2
                "
              >
                Check It Out!
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventFeed;
