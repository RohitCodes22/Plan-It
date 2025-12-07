import React from "react";

export default function CommentWidget(args) {
  return (
    <div className="border rounded-md mt-2 mb-2">
        <div className="flex flex-row">
            <div className="h-8 w-8 rounded-full bg-blue-300 m-2 mr-4"></div>
            <div className="mt-2"> {args.username} </div>
        </div>
        
        <div className="m-2">{args.text}</div>
    </div>
  );
}