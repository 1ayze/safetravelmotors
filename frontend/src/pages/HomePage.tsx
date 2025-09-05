import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowRight, Star, Shield, Clock, Users, Car, CheckCircle } from 'lucide-react'
import { carsAPI } from '../lib/api'
import HeroSection from '../components/home/HeroSection'
import FeaturedCars from '../components/home/FeaturedCars'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CTASection from '../components/home/CTASection'
import StatsSection from '../components/home/StatsSection'

const HomePage: React.FC = () => {
  const { data: featuredCars, isLoading: carsLoading } = useQuery(
    'featured-cars',
    () => carsAPI.getFeatured(),
    {
      select: (response) => response.data.data.cars,
    }
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

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
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default HomePage





