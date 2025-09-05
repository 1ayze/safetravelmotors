import React from 'react'
import { Shield, Award, Clock, Users, Wrench, DollarSign } from 'lucide-react'

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Every vehicle undergoes a comprehensive inspection to ensure quality and reliability.'
    },
    {
      icon: Award,
      title: 'Certified Dealers',
      description: 'We are certified dealers with years of experience in the automotive industry.'
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Fast and efficient service to get you on the road as quickly as possible.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our knowledgeable team is here to help you find the perfect vehicle.'
    },
    {
      icon: Wrench,
      title: 'Maintenance Support',
      description: 'Comprehensive maintenance and repair services for all your automotive needs.'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Competitive pricing with flexible financing options to fit your budget.'
    }
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">Why Choose SafeTravels Motors?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're committed to providing exceptional service and quality vehicles. Here's what sets us apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl hover:shadow-medium transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs





