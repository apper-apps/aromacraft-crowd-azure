import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import { useCart } from '@/hooks/useCart'

const CartItem = ({ item, product }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId, item.selectedSize)
    } else {
      updateQuantity(item.productId, item.selectedSize, newQuantity)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h4 className="font-display font-semibold text-white text-lg">
            {product.name}
          </h4>
          <p className="text-white/60 text-sm">
            {item.selectedSize} • {product.origin}
          </p>
          <p className="text-accent font-medium">
            {formatPrice(item.unitPrice)} each
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            variant="ghost"
            size="sm"
            icon="Minus"
          />
          
          <span className="text-white font-medium px-3 py-1 glass-panel rounded">
            {item.quantity}
          </span>
          
          <Button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            variant="ghost"
            size="sm"
            icon="Plus"
          />
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-white">
            {formatPrice(item.unitPrice * item.quantity)}
          </p>
          <Button
            onClick={() => removeFromCart(item.productId, item.selectedSize)}
            variant="ghost"
            size="sm"
            icon="Trash2"
            className="text-red-400 hover:text-red-300"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem