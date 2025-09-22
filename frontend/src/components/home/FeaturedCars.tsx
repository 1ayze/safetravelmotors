import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Gauge, Fuel, Settings, MapPin } from 'lucide-react'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  fuelType: string
  transmission: string
  bodyType: string
  color: string
  images: string[]
  isFeatured: boolean
}

interface FeaturedCarsProps {
  cars: Car[] | undefined
  isLoading: boolean
}

const FeaturedCars: React.FC<FeaturedCarsProps> = ({ cars, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No featured cars available at the moment.</p>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car, index) => (
          <div
            key={car.id}
            className="card hover:shadow-medium transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Car Image */}
            <div className="relative overflow-hidden">
              <div className="aspect-video bg-gray-200">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Featured Badge */}
              {car.isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="badge-primary">Featured</span>
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {formatPrice(car.price)}
                </span>
              </div>
            </div>

            {/* Car Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {car.brand} {car.model}
                </h3>
                <p className="text-gray-600">{car.year} • {car.color}</p>
              </div>

              {/* Car Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Gauge className="w-4 h-4" />
                  <span>{formatMileage(car.mileage)} mi</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Settings className="w-4 h-4" />
                  <span>{car.transmission}</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/cars/${car.id}`}
                className="btn-primary w-full justify-center group-hover:bg-primary-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
  )
}

export default FeaturedCars
