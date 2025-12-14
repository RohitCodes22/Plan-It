import React from "react";
import { useRouter } from "next/navigation";

export default function CalendarItem({ title, time, color = "bg-indigo-600", id }) {
  const router = useRouter();
  function handleClick() {
    router.push(`/event_page/${id}`);
  }

  return (
    <div
      onClick={handleClick}
      className={`${color} text-white text-xs rounded px-1 py-0.5 mb-1 truncate cursor-pointer`}
      title={title}
    >
      {time && <span className="font-semibold">{time} </span>}
      {title}
    </div>
  );
}