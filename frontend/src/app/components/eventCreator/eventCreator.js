import { API_URL } from "@/app/api";
import React, { useState } from "react";
import LocationSelector from "./locationSelector";
import PhotoUpload from "./photoUpload";

export default function EventCreator() {
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    date: "",
    description: "",
  });

  function handleMapSelect(coords) {
    setEventData({ ...eventData, location: {
        latitude: coords.lon,
        longitude: coords.lat,
        srid: 4326
    } })
  }

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) =>
    setEventData({ ...eventData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDataRes = await fetch(`${API_URL}/get_user_info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

    if (userDataRes.status == 401) {
        alert("Please sign in!");
        return;
    }
    const userData = await userDataRes.json();
    
    console.log(eventData);

    const postData = {
        name: eventData.name,
        tags: ["cool", "very epic!"],
        description: eventData.description,
        date: eventData.date,
        organizer_id: userData.id,
        location: eventData.location
    };

    const post = fetch(`${API_URL}/create_event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData)
    });

    // add to attendee table
    // const 

    closeModal();
  };

  return (
    <div className="w-full">

      <button
        onClick={openModal}
        className="w-full border border-gray-300 rounded-lg py-6 text-lg text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all"
      >
        Add Event +
      </button>

      {showModal ? (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <LocationSelector value={eventData} onSelect={handleMapSelect}/>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload a photo
                </label>
                <PhotoUpload/>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save Event
                </button>
              </div>

            </form>
          </div>

        </div>
      ) : <></>}
    </div>
  );
}
