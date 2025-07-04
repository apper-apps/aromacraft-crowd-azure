import { useState, useEffect } from 'react'

export const useCart = () => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('aromacraft-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('aromacraft-cart', JSON.stringify(cart))
  }, [cart])

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

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}