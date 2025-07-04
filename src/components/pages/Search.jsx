import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/organisms/ProductGrid'
import FilterPanel from '@/components/molecules/FilterPanel'
import Button from '@/components/atoms/Button'
import { productService } from '@/services/api/productService'
import ApperIcon from '@/components/ApperIcon'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: null
  })

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    searchProducts()
  }, [products, query, filters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = () => {
    let filtered = [...products]

    // Search filter
    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.origin.toLowerCase().includes(searchTerm) ||
        product.aromaProfile.some(aroma => aroma.toLowerCase().includes(searchTerm)) ||
        product.flavorNotes.some(note => note.toLowerCase().includes(searchTerm)) ||
        product.essence.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.type === filters.category)
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const minPrice = Math.min(...product.prices.map(p => p.price))
        return minPrice >= filters.priceRange.min && 
               (filters.priceRange.max === Infinity || minPrice <= filters.priceRange.max)
      })
    }

    setFilteredProducts(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-xl text-white/80">
              Showing results for "<span className="text-accent">{query}</span>"
            </p>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel - Desktop */}
          <div className="hidden lg:block lg:w-80 shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                icon="Filter"
                className="w-full"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6"
              >
                <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              </motion.div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Search Results
                </h2>
                <p className="text-white/60">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <ApperIcon name="Search" size={20} className="text-white/60" />
                <span className="text-white/60 text-sm">Results</span>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search