import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Classes from './navbar.module.css'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa'
import { GiHairStrands } from 'react-icons/gi'
import swal from 'sweetalert'
import { useCart } from '../../components/frontend/context/CartContext'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false) // State to toggle menu
  const [menu, setMenu] = useState('market')
  const [categories, setCategories] = useState([])
  const { cartCount, fetchCartData } = useCart()

  useEffect(() => {
    fetchCartData()

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/all-category`)
        if (response.data && Array.isArray(response.data.category)) {
          const filteredCategories = response.data.category.filter(
            (category) => category.navdisplay === 0
          )
          setCategories(filteredCategories)
        } else {
          console.error('Unexpected response format:', response.data)
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [fetchCartData])

  const logoutSubmit = (e) => {
    e.preventDefault()
    axios.post(`/api/logout`).then((res) => {
      if (res.data.status === 200) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_username')
        swal('Logged out.', res.data.message, 'success')
        window.location.href = '/'
      }
    })
  }

  const AuthButtons = !localStorage.getItem('auth_token') ? (
    <Link to='/login'>
      <button className={Classes.login_button}>Login</button>
    </Link>
  ) : (
    <button
      type='button'
      onClick={logoutSubmit}
      className={Classes.login_button}
    >
      Logout
    </button>
  )

  // Toggle menu visibility
  const toggleMenu = () => {
    // setMenuOpen(!menuOpen)
    setMenuOpen((prevState) => !prevState)
  }

  // Close menu when an option is clicked
  const handleMenuClick = (slug) => {
    setMenu(slug)
    setMenuOpen(false) // Close the menu
  }

  return (
    <div className={Classes.navbar}>
      <div className={Classes.nav_logo}>
        <Link to='/' className={Classes.logo_link}>
          <GiHairStrands size={38} className={Classes.logo_icon} alt='logo' />
          <span className={Classes.logo_text}>HAIRMOSPHERE</span>
        </Link>
      </div>
      <div className={Classes.menu_icon} onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      <ul className={`${Classes.nav_menu} ${menuOpen ? Classes.active : ''}`}>
        <li onClick={() => handleMenuClick('market')}>
          <Link to='/' className={Classes.nav_link}>
            Market
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id} onClick={() => handleMenuClick(category.slug)}>
            <Link to={`/${category.slug}`} className={Classes.nav_link}>
              {category.name}
            </Link>
          </li>
        ))}
        <li>{AuthButtons}</li>
        <li onClick={() => handleMenuClick('cart')}>
          <Link to='/cart' className={Classes.nav_link}>
            <div className={Classes.cart_icon}>
              <FaShoppingCart size={30} className={Classes.cart_icon} />
              <span className={Classes.nav_cart_count}>{cartCount}</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
