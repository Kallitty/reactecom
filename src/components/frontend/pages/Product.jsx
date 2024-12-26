import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import Breadcrum from '../components/Breadcrum/Breadcrum'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
import './product.css' // Import the CSS file for styling

const Product = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentProductCategoryId, setCurrentProductCategoryId] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`/product/${productId}`)
        console.log('API Response:', response.data) // Log the full API response

        if (response.data.status === 200) {
          setProduct(response.data.product)
          setCurrentProductCategoryId(response.data.product.category_id)
          setLoading(false)
        } else {
          console.error('Failed to fetch product data.')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className='loading-container'>
        <ClipLoader size={50} color={'#e1356b'} loading={loading} />
      </div>
    )
  }

  return (
    <div>
      <Breadcrum product={product} />

      <div className='product-layout'>
        <div className='product-main'>
          <ProductDisplay productId={productId} product={product} />
          {product ? (
            <DescriptionBox
              description={product.description}
              reviewCount={product.reviewCount}
            />
          ) : (
            <div className='loading-container'>
              <ClipLoader size={50} color={'#e1356b'} loading={loading} />
            </div>
          )}
        </div>

        <div className='product-related'>
          <RelatedProducts
            currentProductCategoryId={currentProductCategoryId}
            productId={product.id}
          />
        </div>
      </div>
    </div>
  )
}

export default Product
