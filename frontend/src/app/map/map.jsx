"use client";
import { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";

// ---------------------------------------------
// Custom Marker Icon
// ---------------------------------------------
const eventIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [0, -45],
});

// ---------------------------------------------
// Component: Smooth Recenter
// ---------------------------------------------
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lng, lat], 17);
  }, [lat, lng]);
  return null;
}

export default function MyMap() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState({ lat: 37.948544, lng: -91.77153 });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ---------------------------------------------
  // Get User Location
  // ---------------------------------------------
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lng: pos.coords.latitude,
          lat: pos.coords.longitude,
        });
      },
      () => {
        console.warn("Permission denied. Using fallback coords.");
      }
    );
  };

  // ---------------------------------------------
  // Fetch Local Events
  // ---------------------------------------------
  const get_feed = async (lat, lng) => {
    try {
      const response = await fetch("http://localhost:80/events/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lng,
          longitude: lat,
          max_distance: 500000000,
          filters: [],
        }),
      });
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickEvent = (id) => {
    router.push(`/event_page/${id}`);
  };

  // Load user location
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch event feed when location updates
  useEffect(() => {
    get_feed(location.lat, location.lng);
  }, [location]);

  return (
    <div className="flex w-full h-[600px]">
      {/* ------------------------------------------------------------------- */}
      {/* LEFT SIDEBAR */}
      {/* ------------------------------------------------------------------- */}
      <div className="w-80 bg-gray-100 border-r overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Nearby Events</h2>

        {events.length === 0 && (
          <p className="text-gray-500">No events found nearby.</p>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className={`p-3 mb-3 rounded cursor-pointer border 
              ${
                selectedEvent?.id === event.id
                  ? "bg-blue-200 border-blue-500"
                  : "bg-white hover:bg-gray-200"
              }
            `}
          >
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-700">
              {event.description?.slice(0, 80) || "No description available"}
              {event.description?.length > 80 ? "..." : ""}
            </p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MAP AREA */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <RecenterMap
            lat={selectedEvent?.location?.lat || location.lat}
            lng={selectedEvent?.location?.lng || location.lng}
          />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          <Marker position={[location.lat, location.lng]} icon={eventIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Event markers */}
          {events.map((event) => (
            <Marker
              key={event.id}
              icon={eventIcon}
              position={[event.location.lng, event.location.lat]}
              eventHandlers={{
                click: () => setSelectedEvent(event),
              }}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">{event.name}</h2>
                  <p className="text-sm">{event.description}</p>
                  <button
                    onClick={() => handleClickEvent(event.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View Event
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
