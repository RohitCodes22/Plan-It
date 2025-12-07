import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { GoPersonFill } from "react-icons/go";

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t-2 border-gray-200 flex justify-center">
      <nav className="flex items-center justify-center p-4 text-2xl gap-x-20">
        <a href="/home">
          <FaHome />
        </a>
        <a href="/TODO">
          <FaSearch />
        </a>
        <a href="/TODO">
          <MdEventAvailable />
        </a>
        <a href="/map">
          <FaMapLocationDot />
        </a>
        <a href="/profile">
          <GoPersonFill />
        </a>
      </nav>
    </div>
  );
};

export default BottomNavBar;
