import React from 'react'
import { Car, Users, Star, Award } from 'lucide-react'

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Car,
      value: '500+',
      label: 'Cars Sold',
      description: 'Quality vehicles delivered to happy customers'
    },
    {
      icon: Users,
      value: '1,200+',
      label: 'Happy Customers',
      description: 'Satisfied customers who trust our service'
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Customer Rating',
      description: 'Average rating based on customer reviews'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years Experience',
      description: 'Years of expertise in the automotive industry'
    }
  ]

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StatsSection





