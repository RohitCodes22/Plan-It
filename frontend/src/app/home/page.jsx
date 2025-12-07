import React from 'react'
import Header from '../components/header/header_logged_in'
import BottomNavBar from '../components/bottomNavBar/bottom_nav_bar'
import EventFeed from '../components/eventFeed/eventFeed'
const Page = () => {
  return (
    <div>
        <Header />
        <div>
            <EventFeed />
        </div>
        <BottomNavBar />
    </div>
  )
}

export default Page