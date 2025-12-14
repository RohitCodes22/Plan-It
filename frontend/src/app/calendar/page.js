"use client"
import Header from "../components/header/header_logged_in";
import Calendar from "./calendar";
import  { React, useEffect, useState } from "react";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
import { API_URL } from "../api";
export default function ProfilePage() {
    const [userEvents, setUserEvents] = useState(null);

    useEffect(() => {
        async function fetchData() {
            // get events user is attending
            const eventRes = await fetch(`${API_URL}/user/get_user_events`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            const events = await eventRes.json();

            for (let i = 0; i < events.length; i++) {
                let date = new Date(events[i].event_date);
                events[i].day = date.getDate() + 1;
                events[i].month = date.getMonth() + 1;
            }
            setUserEvents(events);
        }

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-white font-sans">
            <Header />
            <main className = "pt-20 pb-20">
            <Calendar arg_events={userEvents}/>
            </main>
            <BottomNavBar />
        </div>
    );
}