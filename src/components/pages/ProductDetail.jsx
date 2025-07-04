import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { productService } from '@/services/api/productService'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getById(parseInt(id))
      setProduct(data)
      setSelectedSize(data.prices[0]) // Set default size
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    
    addToCart(product.Id, selectedSize.size, quantity, selectedSize.price)
    toast.success(`${product.name} added to cart!`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProduct} />
  if (!product) return <Error message="Product not found" />

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-white/60 hover:text-white transition-colors">
            <ApperIcon name="ArrowLeft" size={20} className="inline mr-2" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card rounded-xl overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="primary">
                  {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </Badge>
                <Badge variant="accent">
                  {product.origin}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-display font-bold text-white mb-4">
                {product.name}
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Aroma Profile */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Sparkles" size={24} className="text-accent" />
                Aroma Profile
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.aromaProfile.map((aroma, index) => (
                  <Badge key={index} variant="outline">
                    {aroma}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Flavor Notes */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Coffee" size={24} className="text-accent" />
                Flavor Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.flavorNotes.map((note, index) => (
                  <Badge key={index} variant="outline">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Essence */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Heart" size={24} className="text-accent" />
                Essence
              </h3>
              <p className="text-white/80 leading-relaxed">
                {product.essence}
              </p>
            </div>

            {/* Brewing Instructions */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <ApperIcon name="Droplets" size={24} className="text-accent" />
                Brewing Instructions
              </h3>
              <p className="text-white/80 leading-relaxed">
                {product.brewingInstructions}
              </p>
            </div>

            {/* Size Selection */}
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-xl font-display font-semibold text-white mb-4">
                Select Size
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.prices.map((priceOption, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(priceOption)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedSize?.size === priceOption.size
                        ? 'border-accent bg-accent/20 text-white'
                        : 'border-glass-border glass-panel text-white/80 hover:border-accent/50'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {priceOption.size}
                    </div>
                    <div className="text-lg font-bold">
                      {formatPrice(priceOption.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    Quantity
                  </h3>
                  <p className="text-white/60 text-sm">
                    {selectedSize ? `${formatPrice(selectedSize.price)} per ${selectedSize.size}` : 'Select a size'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="ghost"
                    size="sm"
                    icon="Minus"
                  />
                  <span className="text-xl font-bold text-white px-4 py-2 glass-panel rounded">
                    {quantity}
                  </span>
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    variant="ghost"
                    size="sm"
                    icon="Plus"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/80">Total:</span>
                <span className="text-3xl font-bold text-gradient">
                  {selectedSize ? formatPrice(selectedSize.price * quantity) : '--'}
                </span>
              </div>
              
              <Button
                onClick={handleAddToCart}
                variant="accent"
                size="lg"
                icon="ShoppingCart"
                className="w-full"
                disabled={!selectedSize}
              >
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail