import React from "react";

export default function TagWidget(args) {
  let cssString = `rounded border-1 border-grey-100 pl-1 pr-1 text-${args.color}-700 bg-${args.color}-200 font-bold hover:scale-102`
  console.log(cssString)
  return (
    <li className={cssString}>
        {args.text}
    </li>
  );
}