import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useCart } from '@/hooks/useCart'
import { checkoutService } from '@/services/api/checkoutService'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'

const Address = () => {
  const navigate = useNavigate()
  const { checkoutData, updateCheckoutData } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    ...checkoutData.address
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Redirect if customer details not completed
    if (!checkoutData.customer) {
      navigate('/checkout/customer-details')
      return
    }
    
    if (checkoutData.address) {
      setFormData(prev => ({ ...prev, ...checkoutData.address }))
    }
  }, [checkoutData, navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setLoading(true)
    
    try {
      // Validate address with service
      const validation = await checkoutService.validateAddress(formData)
      
      if (validation.valid) {
        updateCheckoutData('address', validation.normalized)
        toast.success('Address validated and saved')
        navigate('/checkout/payment')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to validate address')
    } finally {
      setLoading(false)
    }
  }

  const fillSampleAddress = () => {
    setFormData({
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    })
    toast.info('Sample address filled')
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Delivery Address
          </h1>
          <p className="text-white/60">
            Where should we deliver your order?
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-6 gap-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={16} />
            </div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">2</span>
            </div>
            <div className="w-12 h-1 bg-white/20"></div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white/60 font-semibold text-sm">3</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 sm:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-white">
              Address Information
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillSampleAddress}
              className="text-accent hover:text-accent/80"
            >
              Use Sample Address
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Street Address *
              </label>
              <Input
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                icon="MapPin"
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-400">{errors.street}</p>
              )}
            </div>

            {/* Apartment/Suite */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Apartment, Suite, etc. (Optional)
              </label>
              <Input
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Enter apartment or suite number"
                icon="Building"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  City *
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  State *
                </label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-400">{errors.state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ZIP Code *
                </label>
                <Input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP"
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-400">{errors.zipCode}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 glass-panel rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
              >
                <option value="United States" className="bg-gray-800">United States</option>
                <option value="Canada" className="bg-gray-800">Canada</option>
                <option value="Mexico" className="bg-gray-800">Mexico</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/checkout/customer-details')}
                icon="ArrowLeft"
                className="flex-1"
              >
                Back to Details
              </Button>
              
              <Button
                type="submit"
                variant="accent"
                loading={loading}
                icon="ArrowRight"
                className="flex-1"
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        </motion.div>
        
        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 text-white/80">
            <ApperIcon name="Truck" size={20} />
            <div>
              <p className="font-medium">Free shipping on orders over $100</p>
              <p className="text-sm text-white/60">Estimated delivery: 5-7 business days</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Address