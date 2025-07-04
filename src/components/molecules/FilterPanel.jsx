import React from 'react'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FilterPanel = ({ filters, onFilterChange, className = '' }) => {
  const categories = ['all', 'tea', 'coffee']
  const priceRanges = [
    { label: 'Under $20', min: 0, max: 20 },
    { label: '$20 - $50', min: 20, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: 'Over $100', min: 100, max: Infinity }
  ]

  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
        <ApperIcon name="Filter" size={24} />
        Filters
      </h3>
      
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-white font-medium mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onFilterChange({ ...filters, category })}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filters.category === category
                    ? 'bg-accent text-white'
                    : 'glass-panel text-white/80 hover:bg-glass-hover'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-white font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange?.min === range.min}
                  onChange={() => onFilterChange({ ...filters, priceRange: range })}
                  className="w-4 h-4 text-accent bg-transparent border-2 border-glass-border focus:ring-accent"
                />
                <span className="text-white/80">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFilterChange({ category: 'all', priceRange: null })}
          className="w-full glass-button text-white py-2 rounded-lg hover:bg-glass-hover transition-all"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FilterPanel