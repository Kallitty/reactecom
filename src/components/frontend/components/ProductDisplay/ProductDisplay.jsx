import React, { useContext, useState, useEffect } from 'react'
import './productdisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { MarketContext } from '../../context/MarketContext'
import axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import swal from 'sweetalert'
import { useCart } from '../../context/CartContext'

const ProductDisplay = ({ productId }) => {
  const { addToCart } = useCart()
  // const { addToCart } = useContext(MarketContext)
  const [product, setProduct] = useState(null) // Initialize as `null` to handle loading state
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Format prices with commas safely
  const formattedSellingPrice = product?.selling_price?.toLocaleString() || '0'
  const formattedOriginalPrice =
    product?.original_price?.toLocaleString() || '0'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (productId) {
      axios
        .get(`/api/product/${productId}`)
        .then((res) => {
          console.log('API Response:', res.data)
          if (res.data.status === 200) {
            setProduct(res.data.product)
          } else {
            console.error(
              'Failed to fetch product data:',
              res.data.message || 'Unknown error'
            )
          }
        })
        .catch((error) => {
          console.error(
            'Error fetching product:',
            error.response ? error.response.data : error.message
          )
        })
        .finally(() => setLoading(false)) // Set loading to false regardless of success or failure
    }
  }, [productId])

  // Set the main image or default image
  const mainImage =
    product?.product_images && product.product_images.length > 0
      ? `${process.env.REACT_APP_API_BASE_URL}/${product.product_images[0].image_path}`
      : `${process.env.REACT_APP_API_BASE_URL}/uploads/product_image/default-image.jpg`

  console.log('Main image URL:', mainImage) // Log main image URL for verification

  const handleNextImage = () => {
    if (
      product?.product_images &&
      currentImageIndex < product.product_images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prevCount) => prevCount - 1)
  }

  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 1)
  }

  const submitAddtocart = (e) => {
    e.preventDefault()
    if (!product) return // Prevent adding to cart if product is undefined

    const data = {
      product_id: product.id,
      product_qty: quantity,
    }

    axios.post(`/api/add-to-cart`, data).then((res) => {
      if (res.data.status === 201) {
        addToCart(product.id, quantity)
        swal('Success', res.data.message, 'success')
      } else if (res.data.status === 409) {
        swal('Warning', res.data.message, 'warning')
      } else if (res.data.status === 401) {
        swal('Error', res.data.message, 'error')
      } else if (res.data.status === 404) {
        swal('Warning', res.data.message, 'warning')
      }
    })
  }

  if (loading) {
    return (
      <div className='loading-overlay'>
        <ClipLoader size={50} color={'#e1356b'} loading={loading} />
      </div>
    )
  }

  return (
    <div className='productDisplay'>
      <div className='productdisplay-left'>
        <div className='productdisplay-img-list'>
          {product?.product_images?.length > 1 ? (
            product.product_images
              .slice(1)
              .map((img, index) => (
                <img
                  key={index}
                  src={`${process.env.REACT_APP_API_BASE_URL}/${img.image_path}`}
                  alt={`Product variant ${index + 1}`}
                  className='productdisplay-side-img'
                />
              ))
          ) : (
            <img
              src={mainImage}
              alt='Product main'
              className='productdisplay-side-img'
            />
          )}
        </div>
        <div className='productdisplay-img'>
          <img
            className='productdisplay-main-img'
            src={mainImage}
            alt={product?.name || 'Product'}
          />
        </div>
      </div>

      <div className='productdisplay-right'>
        {product?.qty > 0 ? (
          <div>
            <button className='button-green'>In Stock</button>
            <h1>{product?.name || 'Product Name'}</h1>
            <div className='productdisplay-right-stars'>
              <img src={star_icon} alt='Star' />
              <img src={star_icon} alt='Star' />
              <img src={star_icon} alt='Star' />
              <img src={star_icon} alt='Star' />
              <img src={star_dull_icon} alt='Star' />
              <p>(122)</p>
            </div>
            <div className='productdisplay-right-prices'>
              <div className='productdisplay-right-price-old'>
                ₦{formattedOriginalPrice}
              </div>
              <div className='productdisplay-right-price-new'>
                ₦{formattedSellingPrice}
              </div>
            </div>
            <div className='productdisplay-right-description'>
              {product?.description || 'No description available'}
            </div>
            <div className='productdisplay-right-size'>
              <button className='button-wishlist'>Add to Wishlist</button>
              <h1>Select Color</h1>
              <div className='productdisplay-right-sizes'>
                {['Red', 'Brown', 'Black', 'Green', 'Mixed'].map((color) => (
                  <div key={color}>{color}</div>
                ))}
              </div>
            </div>

            <div className='quantity-controls'>
              <button onClick={handleDecrement}>-</button>
              <div className='quantity-display'>{quantity}</div>
              <button onClick={handleIncrement}>+</button>
            </div>
            <button className='button-pink' onClick={submitAddtocart}>
              Add to Cart
            </button>
          </div>
        ) : (
          <label className='button-wishlist'>Out of Stock</label>
        )}
      </div>
    </div>
  )
}

export default ProductDisplay
