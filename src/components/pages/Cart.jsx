import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import CartItem from '@/components/molecules/CartItem'
import Empty from '@/components/ui/Empty'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'

const Cart = () => {
  const { cart, clearCart } = useCart()
  const { products } = useProducts()
  const navigate = useNavigate()
  const cartWithProducts = cart.map(item => ({
    ...item,
    product: products.find(p => p.Id === item.productId)
  })).filter(item => item.product)

  const subtotal = cartWithProducts.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

const handleCheckout = () => {
    navigate('/checkout/customer-details')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Empty
            title="Your cart is empty"
            description="Start exploring our premium collection of teas and coffees to fill your cart with aromatic delights."
            actionText="Start Shopping"
            actionLink="/"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Shopping Cart
            </h1>
            <p className="text-white/60">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" icon="ArrowLeft">
                Continue Shopping
              </Button>
            </Link>
            <Button 
              onClick={handleClearCart}
              variant="ghost" 
              icon="Trash2"
              className="text-red-400 hover:text-red-300"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartWithProducts.map((item, index) => (
                <CartItem
                  key={`${item.productId}-${item.selectedSize}`}
                  item={item}
                  product={item.product}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <ApperIcon name="Receipt" size={24} />
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-white/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                
                {subtotal > 0 && subtotal < 100 && (
                  <div className="text-sm text-accent">
                    <ApperIcon name="Truck" size={16} className="inline mr-1" />
                    Free shipping on orders over $100
                  </div>
                )}
                
                <div className="border-t border-glass-border pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-gradient">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                variant="accent"
                size="lg"
                icon="CreditCard"
                className="w-full mb-4"
              >
                Proceed to Checkout
              </Button>
              
              <div className="text-center text-white/60 text-sm">
                <ApperIcon name="Shield" size={16} className="inline mr-1" />
                Secure checkout with 256-bit SSL encryption
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart