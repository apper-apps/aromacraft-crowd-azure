import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/organisms/ProductGrid'
import FilterPanel from '@/components/molecules/FilterPanel'
import Button from '@/components/atoms/Button'
import { productService } from '@/services/api/productService'
import ApperIcon from '@/components/ApperIcon'

const Home = () => {
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
    applyFilters()
  }, [products, filters])

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

  const applyFilters = () => {
    let filtered = [...products]

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Discover Premium
              <span className="text-gradient block">Tea & Coffee</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Explore our curated collection of artisanal teas and coffees from around the world. 
              Each blend crafted to perfection with detailed flavor profiles and aromatic experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" icon="Coffee">
                Shop Coffee
              </Button>
              <Button variant="outline" size="lg" icon="Leaf">
                Shop Tea
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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

              {/* Products Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {filters.category === 'all' ? 'All Products' : 
                     filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
                  </h2>
                  <p className="text-white/60">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <ApperIcon name="Grid" size={20} className="text-white/60" />
                  <span className="text-white/60 text-sm">Grid View</span>
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
      </section>
    </div>
  )
}

export default Home