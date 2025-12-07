"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
})

export default function MyPage() {
  return <Map />
}
