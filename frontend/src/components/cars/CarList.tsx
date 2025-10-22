import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Gauge, Fuel, Settings, MapPin } from "lucide-react";
import { resolveImageUrl, FALLBACK_CAR_THUMB } from "../../lib/api";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  description: string;
  images: string[];
  location: string;
  isAvailable: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface CarListProps {
  car: Car;
}

const CarList: React.FC<CarListProps> = ({ car }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="lg:w-80 h-64 lg:h-auto">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {car.images && car.images.length > 0 ? (
              <img
                src={resolveImageUrl(car.images[0])}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_CAR_THUMB;
                }}
              />
            ) : (
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <p>No Image Available</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between h-full">
            <div className="flex-1">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {car.make} {car.model}
                </h3>
                <div className="flex items-center text-gray-600 text-sm space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {car.year}
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 mr-1" />
                    {formatMileage(car.mileage)} mi
                  </div>
                  <div className="flex items-center">
                    <Fuel className="w-4 h-4 mr-1" />
                    {car.fuelType}
                  </div>
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-1" />
                    {car.transmission}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {car.description}
              </p>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {car.features.slice(0, 4).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{car.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {car.location}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="lg:ml-6 lg:text-right">
              <div className="mb-4">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {formatPrice(car.price)}
                </div>
                <div className="text-sm text-gray-600">
                  {car.bodyType} • {car.color}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <Link
                  to={`/cars/${car.id}`}
                  className="btn btn-primary flex-1 lg:flex-none"
                >
                  View Details
                </Link>
                <button className="btn btn-outline flex-1 lg:flex-none">
                  Contact Dealer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
