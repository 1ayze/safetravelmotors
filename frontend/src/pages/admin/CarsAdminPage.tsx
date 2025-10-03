import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Car,
  Calendar,
  Gauge,
  DollarSign,
} from "lucide-react";
import { carsAPI, resolveImageUrl, FALLBACK_CAR_THUMB } from "../../lib/api";
import toast from "react-hot-toast";

const CarsAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    condition: "",
    isFeatured: "",
  });

  // Fetch cars
  const {
    data: carsData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["admin-cars", searchQuery, filters],
    () => {
      if (searchQuery) {
        return carsAPI.search({ q: searchQuery, limit: 50 });
      }
      return carsAPI.getAll({
        limit: 50,
        make: filters.make || undefined,
        condition: filters.condition || undefined,
        isFeatured: filters.isFeatured
          ? filters.isFeatured === "true"
          : undefined,
      });
    },
    {
      // Ensure we always get fresh data after add/edit
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      refetchOnWindowFocus: false,
      select: (response) => response, // keep full axios response
    }
  );

  // Force refetch on mount to ensure fresh data after adding a car
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Delete car mutation
  const deleteCarMutation = useMutation(carsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries("admin-cars");
      toast.success("Car deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete car");
    },
  });

  const handleDelete = async (carId: number, carName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${carName}? This action cannot be undone.`
      )
    ) {
      await deleteCarMutation.mutateAsync(carId.toString());
    }
  };

  const cars = carsData?.data?.data?.cars || carsData?.data?.cars || [];

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Car Management
              </h1>
              <p className="text-gray-600">Manage your vehicle inventory</p>
            </div>
            <Link to="/admin/cars/add" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add New Car
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cars by make, model, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={filters.make}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, make: e.target.value }))
                  }
                  className="form-select w-40"
                >
                  <option value="">All Makes</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Audi">Audi</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Nissan">Nissan</option>
                </select>

                <select
                  value={filters.condition}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                  className="form-select w-40"
                >
                  <option value="">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Certified Pre-owned">
                    Certified Pre-owned
                  </option>
                </select>

                <select
                  value={filters.isFeatured}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      isFeatured: e.target.value,
                    }))
                  }
                  className="form-select w-40"
                >
                  <option value="">All Cars</option>
                  <option value="true">Featured</option>
                  <option value="false">Regular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Cars
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Cars</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter((car) => car.condition === "New").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500">
                  <Gauge className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Used Cars</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter((car) => car.condition === "Used").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.length > 0
                      ? formatPrice(
                          cars.reduce((sum, car) => sum + car.price, 0) /
                            cars.length
                        )
                      : "$0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Cars Inventory
            </h3>
          </div>
          <div className="card-body p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading cars...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">
                  Failed to load cars. Please try again.
                </p>
              </div>
            ) : cars.length === 0 ? (
              <div className="p-8 text-center">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No cars found</p>
                <Link to="/admin/cars/add" className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Car
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mileage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {(() => {
                                const imageSrc =
                                  car.images && car.images.length > 0
                                    ? resolveImageUrl(car.images[0])
                                    : "";
                                return imageSrc ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={imageSrc}
                                    onError={(e) => {
                                      const target =
                                        e.currentTarget as HTMLImageElement;
                                      target.src = FALLBACK_CAR_THUMB;
                                    }}
                                    alt={`${car.make} ${car.model}`}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Car className="w-6 h-6 text-gray-400" />
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {car.make} {car.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {car.bodyType} • {car.transmission}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {car.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatMileage(car.mileage)} mi
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(car.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`badge ${
                              car.condition === "New"
                                ? "badge-success"
                                : car.condition === "Used"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {car.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`badge ${
                              car.isFeatured
                                ? "badge-primary"
                                : "badge-secondary"
                            }`}
                          >
                            {car.isFeatured ? "Featured" : "Regular"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/cars/${car.id}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-900"
                              title="View on website"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/cars/edit/${car.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit car"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(car.id, `${car.make} ${car.model}`)
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Delete car"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsAdminPage;
