"use client";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import { API_URL } from "../api";

// ---------------------------------------------
// Marker Icon
// ---------------------------------------------
const pinIcon = new L.Icon({
  iconUrl: "/ronaldo.jpg",
  iconSize: [28, 42],
  iconAnchor: [14, 42],
});

// ---------------------------------------------
// Smooth Recenter
// ---------------------------------------------
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 15, { duration: 0.8 });
  }, [lat, lng]);
  return null;
}

export default function MyMap() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState({
    lat: 37.948544,
    lng: -91.77153,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ---------------------------------------------
  // Get User Location
  // ---------------------------------------------
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => console.warn("Using fallback location")
    );
  }, []);

  // ---------------------------------------------
  // Fetch Events
  // ---------------------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`${API_URL}/events/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          max_distance: 5000000000000000000000000,
          filters: [],
        }),
      });
      setEvents(await res.json());
    };

    fetchEvents();
  }, [location]);

  return (
    <div className="h-screen w-full grid grid-cols-[420px_1fr]">
      {/* ------------------------------------------------ */}
      {/* LEFT: EVENT EXPLORER */}
      {/* ------------------------------------------------ */}
      <aside className="border-r bg-white overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Nearby Events</h1>
          <p className="text-sm text-gray-500">
            Click an event to preview on the map
          </p>
        </div>

        <div className="divide-y">
          {events.length === 0 && (
            <p className="p-6 text-gray-500">No events nearby.</p>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`
                px-6 py-5 cursor-pointer transition
                ${
                  selectedEvent?.id === event.id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <h3 className="font-semibold text-lg mb-1">{event.name}</h3>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {event.description || "No description provided."}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/event_page/${event.id}`);
                }}
                className="text-sm font-medium underline"
              >
                View details →
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ------------------------------------------------ */}
      {/* RIGHT: MAP */}
      {/* ------------------------------------------------ */}
      <main className="relative">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <RecenterMap
            lat={selectedEvent?.location?.lat || location.lat}
            lng={selectedEvent?.location?.lng || location.lng}
          />

          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* User marker */}
          <Marker position={[location.lat, location.lng]} icon={pinIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Event markers */}
          {events.map((event) => (
            <Marker
              key={event.id}
              icon={
                new L.Icon({
                  iconUrl: `${API_URL}/event/picture/${event.id}`,
                  iconSize: [30, 48],
                  iconAnchor: [15, 48],
                  popupAnchor: [0, -45],
                })
              }
              position={[event.location.lng, event.location.lat]}
              eventHandlers={{
                click: () => setSelectedEvent(event),
              }}
            >
              <Popup>
                <div className="w-56">
                  <img
                    src={`${API_URL}/event/picture/${event.id}`}
                    className="w-full h-28 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {event.description}
                  </p>
                  <button
                    onClick={() => router.push(`/event_page/${event.id}`)}
                    className="text-sm font-medium underline"
                  >
                    View event →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
