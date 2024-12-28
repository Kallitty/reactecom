import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import swal from 'sweetalert'
import './productdetail.css'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

function ProductDetail(props) {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({})
  const [category, setCategory] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // Track the current image index
  const [currentProductCategoryId, setCurrentProductCategoryId] = useState(null)

  const navigate = useNavigate()
  const { category_slug, product_slug } = useParams()

  useEffect(() => {
    let isMounted = true

    axios
      .get(`/api/viewproductdetail/${category_slug}/${product_slug}`)
      .then((res) => {
        if (isMounted) {
          if (res.data.status === 200) {
            setProduct(res.data.product)
            setCategory(res.data.product.category)
            setCurrentProductCategoryId(res.data.product.category_id) // Add this line
            setLoading(false)
          } else if (res.data.status === 400) {
            swal('Warning', res.data.message, 'warning')
          } else if (res.data.status === 404) {
            navigate(`/collections/${category.slug}`)
            swal('Warning', res.data.message, 'error')
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })

    return () => {
      isMounted = false
    }
  }, [category_slug, product_slug, navigate])

  // Handle image navigation
  const handleNextImage = () => {
    if (product.images && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevCount) => prevCount - 1)
    }
  }

  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 1)
  }

  const submitAddtocart = (e) => {
    e.preventDefault()

    const data = {
      product_id: product.id,
      product_qty: quantity,
    }
    axios.post(`/api/add-to-cart`, data).then((res) => {
      if (res.data.status === 201) {
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    )
  }

  // Get the current image to display
  const currentImage =
    product.images && product.images.length > 0
      ? `${process.env.REACT_APP_API_BASE_URL}/${product.images[0].image_path}`
      : `${process.env.REACT_APP_API_BASE_URL}/uploads/product_image/default-image.jpg`

  return (
    <div>
      <nav aria-label='breadcrumb'>
        <ol className='bg-warning breadcrumb rounded-0 px-3 py-2'>
          <li className='breadcrumb-item'>
            <Link className='text-decoration-none' to='/collections'>
              Collections
            </Link>
          </li>
          <li className='breadcrumb-item'>
            <Link
              to={`/collections/${category.slug}`}
              className='text-decoration-none'
            >
              {category.name}
            </Link>
          </li>
          <li className='breadcrumb-item'>
            <Link
              to={`/collections/${category.slug}/${product.slug}`}
              className='text-decoration-none'
            >
              {product.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className='container-fluid mb-3'>
        <div className='row'>
          <div className='col-md-4 border-end'>
            <div className='image-slider'>
              <div className='image-wrapper'>
                <button
                  className='prev-btn'
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                >
                  <FaArrowLeft />
                </button>
                <img
                  src={currentImage}
                  alt={product.name}
                  className='product-image'
                />
                <button
                  className='next-btn'
                  onClick={handleNextImage}
                  disabled={currentImageIndex === product.images.length - 1}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className='col-md-8'>
            <h4>
              {product.name}
              <span className='float-end badge btn-sm btn-danger'>
                {product.brand}
              </span>
            </h4>
            <p>{product.description}</p>
            <h4 className='mb-1'>
              NGN:{product.selling_price}
              <s className='ms-2'>NGN: {product.original_price}</s>
            </h4>

            {product.qty > 0 ? (
              <div>
                <button className='btn btn-sm btn-success px-4 mt-2'>
                  In Stock
                </button>
                <div className='row'>
                  <div className='col-md-3 mt-3'>
                    <div className='input-group'>
                      <button
                        type='button'
                        className='input-group-text'
                        onClick={handleDecrement}
                      >
                        -
                      </button>
                      <div className='form-control text-center'>{quantity}</div>
                      <button
                        type='button'
                        className='input-group-text'
                        onClick={handleIncrement}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className='col-md-3 mt-3'>
                    <button
                      type='button'
                      className='btn btn-primary w-100'
                      onClick={submitAddtocart}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className='btn btn-sm btn-danger px-4 mt-2'>
                Out of Stock
              </label>
            )}

            <button type='button' className='btn btn-danger mt-3'>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
