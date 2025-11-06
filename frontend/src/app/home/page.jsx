import React from 'react'
import Header from '../components/header/header_logged_in'
import BottomNavBar from '../components/bottomNavBar/bottom_nav_bar'
const Page = () => {
  return (
    <div>
        <Header />
        <div>
            User Home page
        </div>
        <BottomNavBar />
    </div>
  )
}

export default Page