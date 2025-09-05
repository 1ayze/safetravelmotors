import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { carsAPI } from '../lib/api'
import CarCard from '../components/cars/CarCard'
import CarList from '../components/cars/CarList'
import SearchFilters from '../components/cars/SearchFilters'
import Pagination from '../components/common/Pagination'

type ViewMode = 'grid' | 'list'

const CarsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    maxMileage: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    color: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  })
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setFilters(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: carsData, isLoading, error } = useQuery(
    ['cars', filters, searchQuery],
    () => {
      if (searchQuery) {
        return carsAPI.search({
          q: searchQuery,
          ...filters,
        })
      } else {
        return carsAPI.getAll(filters)
      }
    },
    {
      keepPreviousData: true,
    }
  )

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      maxMileage: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      color: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
    setSearchQuery('')
  }

  const cars = carsData?.data.cars || []
  const pagination = carsData?.data.pagination

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="heading-2 mb-4">Our Vehicle Inventory</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our extensive collection of quality pre-owned vehicles. Use our search and filters to find your perfect car.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by brand, model, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {pagination ? `${pagination.totalItems} Cars Found` : 'Loading...'}
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-600 mt-1">
                      Results for "{searchQuery}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      handleFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' })
                    }}
                    className="form-select w-48"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-desc">Year: Newest First</option>
                    <option value="year-asc">Year: Oldest First</option>
                    <option value="mileage-asc">Mileage: Low to High</option>
                    <option value="mileage-desc">Mileage: High to Low</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn btn-outline"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-soft p-6 mb-6">
                <SearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Failed to load cars. Please try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Results */}
            {!isLoading && !error && (
              <>
                {cars.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No cars found matching your criteria.</p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                          <CarCard key={car.id} car={car} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cars.map((car) => (
                          <CarList key={car.id} car={car} />
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="mt-12">
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarsPage





