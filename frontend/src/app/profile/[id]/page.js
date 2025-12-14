"use client";

import Header from "../../components/header/header";
import BottomNavBar from "../../components/bottomNavBar/bottom_nav_bar";
import { API_URL } from "../../api";
import { use, useState } from "react";
import { useEffect } from "react";
import ProfilePage from "../user_profile";

export default function EventPage({ params }) {
  const resolvedParams = use(params);
  const [eventData, setEventData] = useState(null);
  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans pb-20">
      <Header />
      <ProfilePage cur_user={false} id={resolvedParams.id} />
      <BottomNavBar />
    </div>
  );
}
