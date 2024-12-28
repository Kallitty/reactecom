import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import swal from 'sweetalert'
import { FcSearch } from 'react-icons/fc'

function ViewProduct() {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState([])
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState({})
  const navigate = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    let isMounted = true

    axios
      .get(`/api/fetchproducts/${slug}`)
      .then((res) => {
        if (isMounted) {
          if (res.data.status === 200) {
            setProduct(res.data.product_data.product)
            setCategory(res.data.product_data.category)
            setLoading(false)
          } else if (res.data.status === 400) {
            // swal('Warning', res.data.message, 'warning')
            navigate('/collections')
          } else if (res.data.status === 404) {
            // swal('Warning', res.data.message, 'error')
            navigate('/collections')
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })

    return () => {
      isMounted = false
    }
  }, [slug, navigate])

  const productCount = product.length

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

  const showProductList = productCount ? (
    product.map((productItem) => {
      const categoryName = productItem.category
        ? productItem.category.name
        : 'No Category'

      // Get the first image or a placeholder if no images available
      const firstImage =
        productItem.images && productItem.images.length > 0
          ? `${process.env.REACT_APP_API_BASE_URL}/${productItem.images[0].image_path}`
          : `${process.env.REACT_APP_API_BASE_URL}/uploads/product_image/default-image.jpg`

      return (
        <div
          className='col-md-3'
          style={{
            width: '230px',
            // border: '1px solid #ddd', // Thin border around the card
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Light shadow for a subtle 3D effect
            padding: '10px', // Less padding inside the card
          }}
          key={productItem.id}
        >
          <div className='card mb-4'>
            <div className='product-wrapper'>
              <div className='product-img'>
                <Link
                  to={`/collections/${productItem.category.slug}/${productItem.slug}`}
                >
                  <img
                    src={firstImage}
                    alt={productItem.name}
                    style={{
                      width: '180px',
                      height: '190px',
                      objectFit: 'cover',
                      borderRadius: '5px', // Add some border-radius to the image
                    }}
                  />
                </Link>
                <div className='product-action'>
                  <Link
                    to={`/collections/${productItem.category.slug}/${productItem.slug}`}
                  >
                    <FcSearch />
                  </Link>
                </div>
                <div className='product-content text-center'>
                  <h3
                    style={{
                      fontSize: '16px', // Reduce font size to make it more concise
                      marginBottom: '10px',
                    }}
                  >
                    <Link
                      to={`/collections/${productItem.category.slug}/${productItem.slug}`}
                    >
                      {productItem.name}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  ) : (
    <div className='col-md-12'>
      <h4>No Product Available for {category.slug}</h4>
    </div>
  )

  return (
    <div>
      <nav aria-label='breadcrumb'>
        <ol className='bg-warning breadcrumb rounded-0 px-3 py-2'>
          <li className='breadcrumb-item'>
            <Link className='text-decoration-none' to='/collections'>
              Collection
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
        </ol>
      </nav>

      <div className='container-fluid mb-3'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-md-8'>
                <span className='align-middle font-weight-bold '>
                  {productCount} result{productCount !== 1 ? 's' : ''} for
                  Product
                </span>
              </div>
            </div>
            <hr />
            <div className='container'>
              <div className='row'>{showProductList}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct
