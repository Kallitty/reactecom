import React, { useEffect } from 'react'
import './offers.css'
import hair from '../Assets/hair.png'
import { Link } from 'react-router-dom'

const Offers = () => {
  return (
    <div className='offers'>
      <div className='offers-left'>
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <Link to='/bestseller'>
          <button>Check Now</button>
        </Link>
      </div>
      <div className='offers-right'>
        <img src={hair} alt='hair' />
      </div>
    </div>
  )
}

export default Offers
