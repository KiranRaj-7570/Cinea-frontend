
import { useState } from 'react'
import BookedSection from '../components/BookedSection'
import Footer from '../components/Footer'
import MostReviewedSection from '../components/TrendingSection'
import Navbar from '../components/Navbar'
import ReviewedByFriendsSection from '../components/ReviewedByFriendsSection'
import YourActivitySection from '../components/YourActivitySection'
import TrendingSection from '../components/TrendingSection'


const Home = () => {
  return (
    <div className=' bg-linear-to-b from-[#2f2f2f] via-[#222] to-[#181818] pt-28 '>
    <Navbar />
    <TrendingSection />
    <BookedSection/>
    <ReviewedByFriendsSection />
    <YourActivitySection />
    <Footer />
    </div>
  )
}

export default Home