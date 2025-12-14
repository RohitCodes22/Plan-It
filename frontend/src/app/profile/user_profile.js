"use client";

import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useRouter } from "next/navigation";
import { EventView } from "../components/eventView/eventView";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";

export default function ProfilePage({ cur_user, id }) {
  // -------------------------
  // State
  // -------------------------
  const [viewMode, setViewMode] = useState("attending");
  const [events, setEvents] = useState([]);

  const [dataForProfile, setDataForProfile] = useState({
    fname: "na",
    lname: "na",
    email: "na",
    username: "na",
    bio: "",
    id: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    fname: "",
    lname: "",
    bio: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);

  const [confirmation, setConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // -------------------------
  // Fetch profile + events
  // -------------------------
  const get_user_data = async () => {
    try {
      const res = await fetch(`${API_URL}/get_user_info${ cur_user ? '' : `/${id}` }`, {
        credentials: "include",
      });
      const data = await res.json();
      setDataForProfile(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const get_events = async () => {
    try {
      const res = await fetch(`${API_URL}/user/get_user_events${ cur_user ? '' : `/${id}` }`, {
        credentials: "include",
      });
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    get_user_data();
    get_events();
  }, []);

  // -------------------------
  // Edit lifecycle
  // -------------------------
  const startEdit = () => {
    setEditData({
      fname: dataForProfile.fname,
      lname: dataForProfile.lname,
      bio: dataForProfile.bio || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData({ fname: "", lname: "", bio: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const onImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // -------------------------
  // Save profile (text + image)
  // -------------------------
  const saveProfile = async () => {
    setSaving(true);

    try {
      // Update text fields
      const profileRes = await fetch(`${API_URL}/user/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      if (!profileRes.ok) throw new Error("Profile update failed");

      const profileResult = await profileRes.json();
      setDataForProfile(profileResult.user);

      // Update image if changed
      if (imageFile) {
        console.log(imageFile)
        const formData = new FormData();
        formData.append("image", imageFile);

        const imageRes = await fetch(`${API_URL}/user/update_profile_image`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!imageRes.ok) throw new Error("Image upload failed");
      }

      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // Delete account
  // -------------------------
  const deleteAccount = async () => {
    try {
      const res = await fetch(`${API_URL}/delete_account`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setConfirmation(false);
      setSuccess(true);

      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  // -------------------------
  // Event filtering
  // -------------------------
  const attendingEvents = events.filter(
    (e) => e.organizer_username !== dataForProfile.username
  );

  const organizingEvents = events.filter(
    (e) => e.organizer_username === dataForProfile.username
  );

  const eventsToShow =
    viewMode === "attending" ? attendingEvents : organizingEvents;

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      {/* ------- Profile Header ------- */}
      <header className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 group">
            <Image
              src={
                imagePreview ||
                `${API_URL}/profile/picture/${
                  dataForProfile.id
                }?t=${Date.now()}`
              }
              alt="Profile picture"
              fill
              className="rounded-full object-cover border shadow-sm"
              unoptimized
            />
            {editMode && (
              <label
                className="absolute inset-0 flex items-center justify-center
               rounded-full bg-black/40 cursor-pointer text-4xl"
              >
                <CiEdit className="text-white " />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageSelect}
                />
              </label>
            )}
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

        <span className="text-gray-700 font-medium">
          @{dataForProfile.username}
        </span>

        {editMode ? (
          <textarea
            className="border rounded p-2 mt-2 w-full min-h-[100px]"
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
          />
        ) : (
          <pre className="whitespace-pre-wrap text-gray-800 mt-2">
            {dataForProfile.bio}
          </pre>
        )}

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
                {saving ? "Saving..." : "Save Changes"}
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
      </header>

      {/* ------- View Mode Buttons ------- */}
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
      </div>

      {/* ------- Delete Modals ------- */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              Do you wish to delete your account?
            </h2>
            <p className="text-gray-600">This action is irreversible.</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={deleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmation(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold">Account deleted. Redirecting…</h2>
          </div>
        </div>
      )}

      {/* ------- Events ------- */}
      <main className="w-full">
        <EventView events={eventsToShow} />
      </main>
    </div>
  );
}
