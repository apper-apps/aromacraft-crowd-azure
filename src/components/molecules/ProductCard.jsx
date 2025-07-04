import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const defaultSize = product?.prices?.[0]
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product || !defaultSize) {
      toast.error('Product information is not available')
      return
    }
    
    const cartItem = {
      id: product.Id,
      name: product.name,
      price: defaultSize.price,
      size: defaultSize.size,
      weight: defaultSize.weight,
      imageUrl: product.imageUrl,
      quantity: 1
    }
    
    addToCart(cartItem)
    toast.success(`${product.name} added to cart!`)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
    
    // Retry loading the image up to 2 times
    if (retryCount < 2) {
      setTimeout(() => {
        setImageError(false)
        setImageLoading(true)
        setRetryCount(prev => prev + 1)
      }, 1000)
    }
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!product || !defaultSize) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl glass-card hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="w-full h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          )}
          
          {/* Error fallback */}
          {imageError && (
            <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex flex-col items-center justify-center text-orange-800">
              <div className="text-4xl mb-2">☕</div>
              <div className="text-sm font-medium text-center px-4">
                {product.name}
              </div>
              <div className="text-xs text-orange-600 mt-1">
                {product.type?.toUpperCase()}
              </div>
            </div>
          )}
          
{/* Actual image */}
          {product.imageUrl && !imageError && (
            <img
              src={product.imageUrl}
              alt={product.name || 'Product image'}
              className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ${
                imageLoading ? 'opacity-0 absolute' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Product type badge */}
          {product.type && (
            <div className="absolute top-4 right-4">
              <Badge variant="accent" className="text-xs">
                {product.type.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
          <div className="p-6">
            <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            
            <p className="text-white/80 text-sm mb-3 line-clamp-2">
              {product.essence}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {product.aromaProfile.slice(0, 3).map((aroma, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {aroma}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white/60 text-sm">Starting from</span>
                <span className="text-2xl font-bold text-gradient">
                  {formatPrice(product.prices[0].price)}
                </span>
              </div>
              
              <Button
                onClick={handleQuickAdd}
                variant="accent"
                size="sm"
                icon="Plus"
                className="shrink-0"
              >
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard