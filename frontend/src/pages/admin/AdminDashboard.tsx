import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { Car, Eye, Plus } from "lucide-react";
import { carsAPI, resolveImageUrl, FALLBACK_CAR_THUMB } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const {
    data: carsData,
    isLoading: carsLoading,
    error: carsError,
  } = useQuery("admin-cars", () => carsAPI.getAll({ limit: 5 }));

  const stats = [
    {
      title: "Total Cars",
      value: carsData?.data?.pagination?.totalItems ?? 0,
      icon: Car,
      color: "bg-blue-500",
      link: "/admin/cars",
    },
  ];

  const quickActions = [
    {
      title: "Add New Car",
      description: "Add a new vehicle to your inventory",
      icon: Plus,
      link: "/admin/cars?action=add",
      color: "bg-primary-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" target="_blank" className="btn btn-outline">
                <Eye className="w-4 h-4 mr-2" />
                View Website
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="card hover:shadow-medium transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="ml-3 font-medium text-gray-900">
                          {action.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      New car added to inventory
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Car inventory updated
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Featured car updated
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Cars */}
        {carsLoading ? (
          <div className="mt-8 card">
            <div className="card-body">
              <p className="text-gray-600">Loading recent cars...</p>
            </div>
          </div>
        ) : carsError ? (
          <div className="mt-8 card">
            <div className="card-body">
              <p className="text-red-600">Failed to load cars.</p>
            </div>
          </div>
        ) : carsData?.data.cars && carsData.data.cars.length > 0 ? (
          <div className="mt-8">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Cars
                  </h3>
                  <Link
                    to="/admin/cars"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
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
                      {carsData.data.cars.map((car) => {
                        const imageSrc =
                          car.images && car.images.length > 0
                            ? resolveImageUrl(car.images[0])
                            : "";
                        return (
                          <tr key={car.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {imageSrc ? (
                                    <img
                                      className="h-10 w-10 rounded-lg object-cover"
                                      src={imageSrc}
                                      onError={(e) => {
                                        const target =
                                          e.currentTarget as HTMLImageElement;
                                        target.src = FALLBACK_CAR_THUMB;
                                      }}
                                      alt={`${car.make || car.brand} ${
                                        car.model
                                      }`}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                      <Car className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {car.make || car.brand} {car.model}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {car.year} •{" "}
                                    {Number(car.mileage).toLocaleString()} mi
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${Number(car.price).toLocaleString()}
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
                              <Link
                                to={`/admin/cars/${car.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 card">
            <div className="card-body">
              <p className="text-gray-600">
                No cars yet. Use "Add New Car" to create one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
