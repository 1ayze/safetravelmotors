import React from 'react'

interface Filters {
  page: number
  limit: number
  brand: string
  model: string
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
  maxMileage: string
  fuelType: string
  transmission: string
  bodyType: string
  color: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface SearchFiltersProps {
  filters: Filters
  onFilterChange: (filters: Partial<Filters>) => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
  const transmissions = ['Manual', 'Automatic']
  const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Pickup', 'Wagon', 'Van']
  const colors = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Other']

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <label className="form-label">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="form-label">Year Range</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min Year"
            value={filters.minYear}
            onChange={(e) => onFilterChange({ minYear: e.target.value })}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max Year"
            value={filters.maxYear}
            onChange={(e) => onFilterChange({ maxYear: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Max Mileage */}
      <div>
        <label className="form-label">Maximum Mileage</label>
        <input
          type="number"
          placeholder="e.g., 50000"
          value={filters.maxMileage}
          onChange={(e) => onFilterChange({ maxMileage: e.target.value })}
          className="form-input"
        />
      </div>

      {/* Fuel Type */}
      <div>
        <label className="form-label">Fuel Type</label>
        <select
          value={filters.fuelType}
          onChange={(e) => onFilterChange({ fuelType: e.target.value })}
          className="form-select"
        >
          <option value="">All Fuel Types</option>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="form-label">Transmission</label>
        <select
          value={filters.transmission}
          onChange={(e) => onFilterChange({ transmission: e.target.value })}
          className="form-select"
        >
          <option value="">All Transmissions</option>
          {transmissions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Body Type */}
      <div>
        <label className="form-label">Body Type</label>
        <select
          value={filters.bodyType}
          onChange={(e) => onFilterChange({ bodyType: e.target.value })}
          className="form-select"
        >
          <option value="">All Body Types</option>
          {bodyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="form-label">Color</label>
        <select
          value={filters.color}
          onChange={(e) => onFilterChange({ color: e.target.value })}
          className="form-select"
        >
          <option value="">All Colors</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SearchFilters





