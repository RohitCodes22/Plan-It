"use client";

import Header from "../../components/header/header";
import BottomNavBar from "../../components/bottomNavBar/bottom_nav_bar";
import EventWidget from "../event_widget";
import { API_URL } from "../../api";
import { use, useState } from "react";
import { useEffect } from "react";

export default function EventPage({params}) {
    const resolvedParams = use(params);
    const [eventData, setEventData] = useState(null);
    
    const getEventData = async () => {
        try {
            const response = await fetch(`${API_URL}/get_event/${resolvedParams.eventId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log(`Response status ${response.status}`);

            const eventData = await response.json();
            setEventData(eventData);

        } catch (error) {
            console.error("Error fetching event data:", error);
        }
    };

    useEffect(() => {
        getEventData();
    }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans">
      <Header />
      <main className="w-full max-w-md mt-12 rounded-2xl shadow-lg p-10 border">
        {
            eventData ? <EventWidget data={eventData}/> : <h1> Loading ...</h1>
        }
        
      </main>
      <BottomNavBar />
    </div>
  );
}
