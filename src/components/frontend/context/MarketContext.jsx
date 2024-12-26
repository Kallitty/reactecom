import React, { createContext, useState } from 'react'
// import all_product from '../components/Assets/all_product'

export const MarketContext = createContext(null)

const getDefaultCart = () => {
  let cart = {}
  
  return cart
}

const MarketContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart)

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    console.log(cartItems)
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
       
        // totalAmount += itemInfo.new_price * cartItems[item]
      }
    }
    return totalAmount
  }

  const getTotalCartItems = () => {
    let totalItem = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item]
      }
    }
    return totalItem
  }

  const contextValue = {
    
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  }

  return (
    <MarketContext.Provider value={contextValue}>
      {props.children}
    </MarketContext.Provider>
  )
}

export default MarketContextProvider
