"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";
import { EventView } from "../components/eventView/eventView";
import Image from "next/image";
export default function ProfilePage() {
  const [viewMode, setViewMode] = useState("attending"); // "attending" | "organizing"
  const [events, setEvents] = useState([]);
  const [dataForProfile, setDataForProfile] = useState({
    fname: "na",
    lname: "na",
    email: "na",
    username: "na",
    bio: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    fname: "",
    lname: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  const [confirmation, setConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // -------------------------
  // Delete account
  // -------------------------

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/delete_account`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to delete account");
        return;
      }

      setConfirmation(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // -------------------------
  // Fetch user profile
  // -------------------------
  const get_user_data = async () => {
    try {
      const response = await fetch(`${API_URL}/get_user_info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const dfp = await response.json();
      setDataForProfile(dfp);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // -------------------------
  // Fetch events for user
  // -------------------------
  const get_events = async () => {
    try {
      const response = await fetch(`${API_URL}/user/get_user_events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data)
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    get_user_data();
    get_events();
  }, []);

  // -------------------------
  // Filter events
  // -------------------------
  const attendingEvents = Array.isArray(events)
    ? events.filter(
        (event) => event.organizer_username !== dataForProfile.username
      )
    : [];

  const organizingEvents = Array.isArray(events)
    ? events.filter(
        (event) => event.organizer_username === dataForProfile.username
      )
    : [];

  const eventsToShow =
    viewMode === "attending" ? attendingEvents : organizingEvents;

  // -------------------------
  // Edit Data
  // -------------------------
  const startEdit = () => {
    setEditData({
      fname: dataForProfile.fname,
      lname: dataForProfile.lname,
      bio: dataForProfile.bio || "",
    });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData({ fname: "", lname: "", bio: "" });
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      // Update UI with confirmed backend data
      setDataForProfile(result.user);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // UI Components
  // -------------------------
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      {/* ------- Profile Header ------- */}
      <header className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={`${API_URL}/profile/picture/${dataForProfile.id}`}
              alt="Profile picture"
              fill
              className="rounded-full object-cover border shadow-sm"
              unoptimized
            />
          </div>

          {editMode ? (
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 text-xl font-bold"
                value={editData.fname}
                onChange={(e) =>
                  setEditData({ ...editData, fname: e.target.value })
                }
              />
              <input
                className="border rounded px-2 py-1 text-xl font-bold"
                value={editData.lname}
                onChange={(e) =>
                  setEditData({ ...editData, lname: e.target.value })
                }
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold">
              {dataForProfile.fname} {dataForProfile.lname}
            </h1>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-gray-700 font-medium">
            @{dataForProfile.username}
          </span>

          <div className="mt-3 flex gap-3">
            {!editMode ? (
              <button
                onClick={startEdit}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {editMode ? (
            <textarea
              className="border rounded p-2 mt-2 w-full min-h-[100px]"
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
            />
          ) : (
            <pre className="whitespace-pre-wrap text-gray-800 mt-2">
              {dataForProfile.bio}
            </pre>
          )}
        </div>
      </header>

      {/* ------- Toggle Buttons ------- */}
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode("attending")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "attending"
              ? "bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Attending
        </button>

        <button
          onClick={() => setViewMode("organizing")}
          className={`px-4 py-2 rounded-md border ${
            viewMode === "organizing"
              ? "bg-gray-800 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Organizing
        </button>
        <button
          onClick={() => setConfirmation(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Delete Account
        </button>

        {confirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">
                Do you wish to proceed with account deletion?
              </h2>
              <p className="text-gray-600">This action is irreversible.</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={deleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmation(false)}
                  className="px-4 py-2 rounded-md border hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
              <h2 className="text-x1 font-bold mb-4">
                Account has been successfully deleted. Redirecting to login page
              </h2>
            </div>
          </div>
        )}
      </div>
      {/* ------- Event View Section ------- */}
      <main className="w-full">
        <EventView events={eventsToShow} />
      </main>
    </div>
  );
}
