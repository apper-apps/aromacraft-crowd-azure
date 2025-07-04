import { useState, useEffect } from 'react'

export const useCart = () => {
  const [cart, setCart] = useState([])
  const [checkoutData, setCheckoutData] = useState({})

  useEffect(() => {
    const savedCart = localStorage.getItem('aromacraft-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

useEffect(() => {
    localStorage.setItem('aromacraft-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('aromacraft-checkout')
    if (savedCheckoutData) {
      setCheckoutData(JSON.parse(savedCheckoutData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aromacraft-checkout', JSON.stringify(checkoutData))
  }, [checkoutData])

  const addToCart = (productId, selectedSize, quantity, unitPrice) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.productId === productId && item.selectedSize === selectedSize
      )

      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevCart, { productId, selectedSize, quantity, unitPrice }]
    })
  }

  const updateQuantity = (productId, selectedSize, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId, selectedSize) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.productId === productId && item.selectedSize === selectedSize)
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

const updateCheckoutData = (step, data) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  const clearCheckoutData = () => {
    setCheckoutData({})
    localStorage.removeItem('aromacraft-checkout')
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkoutData,
    updateCheckoutData,
    clearCheckoutData
  }
}