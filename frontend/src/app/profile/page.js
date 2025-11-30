import Header from "../components/header/header_logged_in";
import User_Profile from "./user_profile";
import React from "react";
import styles from "./profile.module.css"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white font-sans">
      <Header />
      <main className={styles.profileMain}>
        <User_Profile />
      </main>
      
    </div>
  );
}