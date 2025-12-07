import React, { useMemo, useState } from "react";
import Link from "next/link";

export const EventView = ({ events }) => {
  const [sortBy, setSortBy] = useState("name");

  // Always call hooks FIRST
  const sortedEvents = useMemo(() => {
    const list = [...events];

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.event_name.localeCompare(b.event_name));
        break;
      case "organizer":
        list.sort((a, b) =>
          a.organizer_username.localeCompare(b.organizer_username)
        );
        break;
      default:
        break;
    }

    return list;
  }, [events, sortBy]);

  // NOW you can conditionally return UI
  if (!events || events.length === 0) {
    return <span>Quit being a bum and sign up for events!</span>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Sorting Control */}
      <select
        className="border rounded-md p-2 mb-3"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="organizer">Sort by Organizer</option>
      </select>

      {/* Event List */}
      <div className="flex flex-col gap-3">
        {sortedEvents.map((event) => (
          <Link
            key={event.event_id}
            href={`/event_page/${event.event_id}`}
            className="border rounded-md p-3 hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold">{event.event_name}</h3>
            <p className="text-sm text-gray-700">
              Organizer: {event.organizer_username}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {event.event_description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
