"use client";
import { useEffect, useState } from "react";
import { getCurrentDate } from "./date";
import CalendarItem from "./calendarItem";

export default function Calendar({arg_events}) {
  const [currentDate, setCurrentDate] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [today, setToday] = useState(0);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);
  const [userEvents, setUserEvents] = useState([]);

function get_days_events(events, daysInMonth) {
  console.log(events);
  const dayEvents = Array.from({ length: daysInMonth.length }, () => []); 

  events.forEach((event) => {

    try {
        const eventDate = new Date(event.event_date);
        const dayNum = eventDate.getDate(); // 1-based day

        
        dayEvents[dayNum].push(
            <CalendarItem
                key={event.event_id}         // always give a key when rendering lists
                title={event.event_name || "Untitled"}
                time={event.time || ""}
                color={event.color || "bg-indigo-600"}
                id={event.event_id}
            />
        );        
    }
    catch {
        console.log(`error when processing event:`)
        console.log(event);
    }

  })

  return dayEvents;
}

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

useEffect(() => {
  if (arg_events && arg_events.length > 0 && daysInMonth.length > 0) {
    const dayData = get_days_events(arg_events, daysInMonth);
    setUserEvents(dayData);
    console.log(dayData);
  }
}, [arg_events, daysInMonth]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col items-center justify-start pt-24">
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
            {userEvents ? userEvents[day] : <></>}
          </div>
        ))}
      </div>
    </div>
  );
}
