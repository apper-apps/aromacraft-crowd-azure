import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '@/components/organisms/ProductGrid'
import FilterPanel from '@/components/molecules/FilterPanel'
import Button from '@/components/atoms/Button'
import { productService } from '@/services/api/productService'
import ApperIcon from '@/components/ApperIcon'

const Category = () => {
  const { type } = useParams()
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: type || 'all',
    priceRange: null
  })

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: type || 'all' }))
  }, [type])

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

  const categoryInfo = {
    tea: {
      title: 'Premium Tea Collection',
      description: 'Discover our carefully curated selection of artisanal teas from renowned tea gardens worldwide.',
      icon: 'Leaf'
    },
    coffee: {
      title: 'Premium Coffee Collection',
      description: 'Explore our exceptional range of single-origin and blended coffees, roasted to perfection.',
      icon: 'Coffee'
    }
  }

  const currentCategory = categoryInfo[type] || {
    title: 'All Products',
    description: 'Browse our complete collection of premium teas and coffees.',
    icon: 'Grid'
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 glass-card rounded-xl">
              <ApperIcon name={currentCategory.icon} size={32} className="text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">
              {currentCategory.title}
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
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

            {/* Products Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  {currentCategory.title}
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
    </div>
  )
}

export default Category