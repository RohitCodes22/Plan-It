"use client";
import { useEffect, useState } from "react";
import { getCurrentDate } from "./date";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [today, setToday] = useState(0);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);

  useEffect(() => {
    const date = new Date();
    setToday(date.getDate());
    setCurrentDate(getCurrentDate());

    const year = date.getFullYear();
    const month = date.getMonth();

    const days = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));

    setFirstDayOfMonth(new Date(year, month, 1).getDay());
  }, []);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-4">Calendar</h1>
      <div className="text-xl mb-8">
        Today's Date: <span className="font-semibold">{currentDate}</span>
      </div>

      <div className="grid grid-cols-7 w-full max-w-5xl text-center mb-2">
        {weekDays.map((day) => (
          <div key={day} className="font-semibold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 w-full max-w-5xl text-center">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`p-4 ${
              day === today
                ? "bg-white text-black font-bold"
                : "hover:bg-gray-200"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
