import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useCart } from '@/hooks/useCart'
import { checkoutService } from '@/services/api/checkoutService'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'

const CardDetails = () => {
  const navigate = useNavigate()
  const { cart, checkoutData, updateCheckoutData, clearCart, clearCheckoutData } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    ...checkoutData.payment
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Redirect if previous steps not completed
    if (!checkoutData.customer || !checkoutData.address) {
      navigate('/checkout/customer-details')
      return
    }
    
    if (checkoutData.payment) {
      setFormData(prev => ({ ...prev, ...checkoutData.payment }))
    }
  }, [checkoutData, navigate])

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)'
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required'
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits'
    }
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 10
    return subtotal + shipping
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    
    try {
      // Validate payment details
      const paymentValidation = await checkoutService.validatePayment(formData)
      
      if (paymentValidation.valid) {
        // Save payment data
        updateCheckoutData('payment', formData)
        
        // Prepare order data
        const orderData = {
          customer: checkoutData.customer,
          address: checkoutData.address,
          payment: {
            ...formData,
            paymentMethodId: paymentValidation.paymentMethodId,
            last4: paymentValidation.last4
          },
          items: cart,
          total: calculateTotal(),
          subtotal: cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
          shipping: calculateTotal() - cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
        }
        
        // Submit order
        const order = await checkoutService.submitOrder(orderData)
        
        // Clear cart and checkout data
        clearCart()
        clearCheckoutData()
        
        toast.success('Order placed successfully!')
        
        // Navigate to success page (or home for now)
        navigate('/', { 
          state: { 
            orderComplete: true, 
            orderNumber: order.orderNumber 
          } 
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  const fillSampleCard = () => {
    setFormData({
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'John Doe'
    })
    toast.info('Sample card details filled')
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Payment Details
          </h1>
          <p className="text-white/60">
            Secure payment processing
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-6 gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={16} />
            </div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={16} />
            </div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">3</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 sm:p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-white">
                Card Information
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fillSampleCard}
                className="text-accent hover:text-accent/80"
              >
                Use Sample Card
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Card Number *
                </label>
                <Input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  icon="CreditCard"
                  maxLength="19"
                  className={errors.cardNumber ? 'border-red-500' : ''}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>
                )}
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Expiry Date *
                  </label>
                  <Input
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    icon="Calendar"
                    maxLength="5"
                    className={errors.expiryDate ? 'border-red-500' : ''}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    CVV *
                  </label>
                  <Input
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    icon="Lock"
                    maxLength="3"
                    className={errors.cvv ? 'border-red-500' : ''}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-400">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cardholder Name *
                </label>
                <Input
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="Name on card"
                  icon="User"
                  className={errors.cardholderName ? 'border-red-500' : ''}
                />
                {errors.cardholderName && (
                  <p className="mt-1 text-sm text-red-400">{errors.cardholderName}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/checkout/address')}
                  icon="ArrowLeft"
                  className="flex-1"
                >
                  Back to Address
                </Button>
                
                <Button
                  type="submit"
                  variant="accent"
                  loading={loading}
                  icon="Lock"
                  className="flex-1"
                >
                  Complete Order
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 sm:p-8"
          >
            <h2 className="text-xl font-display font-bold text-white mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-white/80">
                  <span className="text-sm">
                    {item.quantity}x {item.selectedSize || 'Default Size'}
                  </span>
                  <span className="text-sm">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-glass-border pt-4">
                <div className="flex justify-between text-white/80 mb-2">
                  <span>Subtotal</span>
                  <span>${cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/80 mb-4">
                  <span>Shipping</span>
                  <span>{calculateTotal() - cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) === 0 ? 'Free' : '$10.00'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-gradient">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Security Features */}
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <ApperIcon name="Shield" size={16} />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Lock" size={16} />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Check" size={16} />
                <span>PCI DSS compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CardDetails