"use client";

import dynamic from "next/dynamic";

const LocationSelector = dynamic(
  () => import("./locationSelector"),
  { ssr: false }
);

export default LocationSelector;
