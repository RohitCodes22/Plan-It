"use client";

import { API_URL } from "@/app/api";
import React, { useState } from "react";
import LocationSelector from "./locationSelectorWrapper";
import PhotoUpload from "./photoUpload";

export default function EventCreator() {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    location: null,
    date: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);

  // -------------------------
  // Handlers
  // -------------------------
  const handleMapSelect = (coords) => {
    setEventData({
      ...eventData,
      location: {
        latitude: coords.lon,
        longitude: coords.lat,
        srid: 4326,
      },
    });
  };

  const handleChange = (e) =>
    setEventData({ ...eventData, [e.target.name]: e.target.value });

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setImageFile(null);
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      // Get user
      const userRes = await fetch(`${API_URL}/get_user_info`, {
        credentials: "include",
      });

      if (!userRes.ok) {
        alert("Please sign in!");
        setSubmitting(false);
        return;
      }

      const userData = await userRes.json();

      // Create event
      const eventPayload = {
        name: eventData.name,
        tags: ["cool", "very epic!"],
        description: eventData.description,
        date: eventData.date,
        organizer_id: userData.id,
        location: eventData.location,
      };

      const createRes = await fetch(`${API_URL}/create_event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventPayload),
      });

      console.log(createRes);
      if (!createRes.ok) throw new Error("Event creation failed");

      const createdEvent = await createRes.json();
      const eventId = createdEvent.id;
      console.log(imageFile)
      // -------------------------
      // TODO: Upload event image
      // -------------------------
      if (imageFile && eventId) {
        console.log("HERE")
        const formData = new FormData();
        formData.append("image", imageFile[0]);

        const imageRes = await fetch(
          `${API_URL}/event/update_event_image/${eventId}`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!imageRes.ok) {
          console.error("Image upload failed");
        }
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="w-full">
      <button
        onClick={openModal}
        className="w-full border border-gray-300 rounded-xl py-6 text-lg
                   text-gray-600 hover:bg-gray-100 hover:scale-[1.02]
                   transition-all"
      >
        Add Event +
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center
                        justify-center px-4 z-50">
          <div
            className="bg-white w-full max-w-lg max-h-[90vh]
                       rounded-2xl shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Event</h2>
            </div>

            {/* Scrollable body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2
                             focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <LocationSelector
                  value={eventData}
                  onSelect={handleMapSelect}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2
                               focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 h-24
                             focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Image
                </label>
                <PhotoUpload onChange={setImageFile} />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md
                             hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
