"use client";

import Header from "../../components/header/header_logged_in";
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
            // get data from event table
            const response = await fetch(`${API_URL}/get_event/${resolvedParams.eventId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

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
    <div >
      <Header />
      <main >
        {
            eventData ? <EventWidget data={eventData}/> : <h1> Loading ...</h1>
        }
        
      </main>
      <BottomNavBar />
    </div>
  );
}
