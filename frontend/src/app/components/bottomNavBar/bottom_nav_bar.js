import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { GoPersonFill } from "react-icons/go";

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <nav
        className="
          mx-auto
          flex
          h-16
          max-w-md
          items-center
          justify-around
          text-xl
          sm:text-2xl
        "
      >
        <a href="/home" className="p-2">
          <FaHome />
        </a>
        <a href="/search" className="p-2">
          <FaSearch />
        </a>
        <a href="/calendar" className="p-2">
          <MdEventAvailable />
        </a>
        <a href="/map" className="p-2">
          <FaMapLocationDot />
        </a>
        <a href="/profile" className="p-2">
          <GoPersonFill />
        </a>
      </nav>
    </div>
  );
};

export default BottomNavBar;
