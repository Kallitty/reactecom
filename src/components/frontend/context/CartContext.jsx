import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0)

  const fetchCartData = async () => {
    try {
      const res = await axios.get('/cart')
      if (res.data.status === 200) {
        setCartCount(res.data.cart.length)
      }
    } catch (error) {
      console.error('Error fetching cart data:', error)
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [])

  const addToCart = async (product_id, product_qty) => {
    try {
      const response = await axios.post('/add-to-cart', {
        product_id,
        product_qty,
      })
      if (response.data.status === 201) {
        // Re-fetch the cart data to update the count accurately
        fetchCartData()
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <CartContext.Provider value={{ cartCount, addToCart, fetchCartData }}>
      {children}
    </CartContext.Provider>
  )
}
