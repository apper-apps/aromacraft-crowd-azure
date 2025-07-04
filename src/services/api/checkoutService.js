const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock order data store
let orders = []
let nextOrderId = 1

export const checkoutService = {
  async submitOrder(orderData) {
    await delay(500)
    
    const order = {
      Id: nextOrderId++,
      ...orderData,
      orderNumber: `ORD-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    orders.push(order)
    return { ...order }
  },

  async getOrderById(id) {
    await delay(200)
    const order = orders.find(o => o.Id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    return { ...order }
  },

  async getAllOrders() {
    await delay(300)
    return [...orders]
  },

  async validateAddress(address) {
    await delay(400)
    
    // Basic address validation
    const isValid = address.street && address.city && address.zipCode && address.country
    
    if (!isValid) {
      throw new Error('Invalid address provided')
    }
    
    return {
      valid: true,
      normalized: {
        ...address,
        street: address.street.trim(),
        city: address.city.trim(),
        zipCode: address.zipCode.trim(),
        country: address.country.trim()
      }
    }
  },

  async validatePayment(paymentData) {
    await delay(600)
    
    // Mock payment validation
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentData
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      throw new Error('All payment fields are required')
    }
    
    // Mock card validation (simple checks)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      throw new Error('Invalid card number')
    }
    
    if (cvv.length !== 3) {
      throw new Error('Invalid CVV')
    }
    
    return {
      valid: true,
      paymentMethodId: `pm_${Date.now()}`,
      last4: cardNumber.slice(-4)
    }
  }
}