import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Gauge, Fuel, Settings } from "lucide-react";
import { resolveImageUrl, FALLBACK_CAR_THUMB } from "../../lib/api";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  images: string[];
  isFeatured: boolean;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
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
    <div className="card hover:shadow-medium transition-all duration-300 group">
      {/* Car Image */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-gray-200">
          {car.images && car.images.length > 0 ? (
            <img
              src={resolveImageUrl(car.images[0])}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_CAR_THUMB;
              }}
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
            {car.make} {car.model}
          </h3>
          <p className="text-gray-600">
            {car.year} • {car.color}
          </p>
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
  );
};

export default CarCard;
