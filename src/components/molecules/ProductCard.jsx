import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add the smallest size by default
    const defaultSize = product.prices[0]
    addToCart(product.Id, defaultSize.size, 1, defaultSize.price)
    toast.success(`${product.name} added to cart!`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.Id}`}>
        <div className="glass-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="relative overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="primary">
                {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="accent">
                {product.origin}
              </Badge>
            </div>
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