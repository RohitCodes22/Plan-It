import React from "react";
import Header from "../components/header/header_logged_in";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
import EventFeed from "../components/eventFeed/eventFeed";
const Page = () => {
  return (
    <div>
      <Header />
      <main className="flex-1 mb-15">
        <EventFeed />
      </main>
      <BottomNavBar />
    </div>
  );
};

export default Page;
