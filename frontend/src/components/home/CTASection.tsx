import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Mail } from 'lucide-react'

const CTASection: React.FC = () => {
  return (
    <section className="section bg-primary-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-primary-700/50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="heading-2 text-white mb-6">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Browse our extensive inventory of quality pre-owned vehicles. Our expert team is here to help you find the perfect car that fits your needs and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/cars"
              className="btn bg-white text-primary-600 hover:bg-gray-100 focus:ring-white btn-lg"
            >
              Browse Our Inventory
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg"
            >
              Contact Us Today
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-primary-100">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <a href="tel:+15551234567" className="hover:text-white transition-colors">
                +1 (555) 123-4567
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <a href="mailto:info@safetravelsmotors.com" className="hover:text-white transition-colors">
                info@safetravelsmotors.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection


