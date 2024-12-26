import React from 'react'
import './hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import default_hair from '../Assets/default_hair.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVALS FOR YOU</h2>
        <div className='hand-hand-icon'>
          <p>New</p>
          <img src={hand_icon} alt='' />
        </div>
        <p>collections</p>
        <p>for everyone </p>
        <Link to='/humanhair' style={{ textDecoration: 'none' }}>
          <div className='hero-latest-btn'>
            <div>Latest Collections</div>

            <img src={arrow_icon} alt='arrow' />
          </div>
        </Link>
      </div>
      <div className='hero-right'>
        <img src={default_hair} alt='hair_image' />
      </div>
    </div>
  )
}

export default Hero
