"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";

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

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat: lat, lon: lng });
    },
  });
  return null;
}

export default function LocationSelector({value, onSelect}) {
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

  // Load user location
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="flex w-full h-[200px]">
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
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
          />

        <ClickHandler onSelect={onSelect} />

        {value.location && <Marker position={[value.location.longitude, value.location.latitude]} />}

        </MapContainer>
      </div>
    </div>
  );
}
