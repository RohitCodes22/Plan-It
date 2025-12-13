"use client";

import dynamic from "next/dynamic";
import Header from "../components/header/header_logged_in";
import BottomNavBar from "../components/bottomNavBar/bottom_nav_bar";
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});

export default function MyPage() {
  return (
    <div>
      <Header />
      <main className="flex-1 mb-15">
        <Map />
      </main>
      <BottomNavBar />
    </div>
  );
}
