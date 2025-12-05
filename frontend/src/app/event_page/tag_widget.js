import React from "react";

// had to add this because if I don't, Tailwind will purge unused class names
const colorMap = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
};

export default function TagWidget(args) {
  return (
    <li className={`transition-all select-none rounded border-1 border-grey-100 pl-1 pr-1 font-bold hover:scale-106 ${colorMap[args.color]}`}>
        {args.text}
    </li>
  );
}