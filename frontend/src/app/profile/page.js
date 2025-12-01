import Header from "../components/header/header_logged_in";
import User_Profile from "./user_profile";
import React from "react";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans">
      <Header />
      <main>
        <User_Profile />
      </main>
      <BottomNavBar />
    </div>
  );
}