import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowRight, Star, Shield, Clock, Users, Car, CheckCircle, X, Play } from 'lucide-react'
import { carsAPI } from '../lib/api'
import HeroSection from '../components/home/HeroSection'
import FeaturedCars from '../components/home/FeaturedCars'
import WhyChooseUs from '../components/home/WhyChooseUs'

import CTASection from '../components/home/CTASection'
import StatsSection from '../components/home/StatsSection'

const HomePage: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false)

  const { data: featuredCars, isLoading: carsLoading } = useQuery(
    'featured-cars',
    () => carsAPI.getFeatured(),
    {
      select: (response) => response.data.data.cars,
    }
  )

  const handleWatchVideo = () => {
    setShowVideo(true)
  }

  const handleCloseVideo = () => {
    setShowVideo(false)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onWatchVideo={handleWatchVideo} />

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video Container */}
            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-auto max-h-[80vh] object-contain"
                controls
                autoPlay
                muted
              >
                <source src="/THE BEST COMPANY THAT SELLS KOREAN CARS IN AFRICA WE'VE GOT YOU COVERED ST MOTORS - Safe Travel Motors (1080p, h264).mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Featured Car Showcase</h3>
                  <p className="text-lg opacity-90">Experience our premium vehicles in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Cars */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Featured Vehicles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pre-owned vehicles, each carefully inspected and ready for the road.
            </p>
          </div>

          <FeaturedCars cars={featuredCars} isLoading={carsLoading} />

          <div className="text-center mt-12">
            <Link to="/cars" className="btn-primary btn-lg">
              View All Cars
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default HomePage





