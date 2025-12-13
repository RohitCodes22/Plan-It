import React from "react";
import { API_URL } from "../api";
import Image from "next/image";

export default function CommentWidget(args) {
  return (
    <div className="border rounded-md mt-2 mb-2">
        <div className="flex flex-row">
        <div className="relative w-8 h-8 ml-2 mr-2 mt-1 flex-shrink-0">
        <Image
            src={`${API_URL}/profile/picture/${args.id}`}
            alt="Profile picture"
            fill
            className="rounded-full object-cover border shadow-sm"
            unoptimized
        />
        </div>
            <div className="mt-2"> {args.username} </div>
        </div>
        
        <div className="m-2">{args.text}</div>
    </div>
  );
}