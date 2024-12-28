import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Item from '../Item/Item'
import './popular.css'

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    axios
      .get('/api/popular-products')
      .then((res) => {
        if (res.data.status === 200) {
          setPopularProducts(res.data.popularProducts)
        }
      })
      .catch((error) => {
        console.error('Error fetching popular products:', error)
      })
  }, [])

  return (
    <div className='popular'>
      <h1>Popular Human Hairs</h1>
      <hr />
      <div className='popular-item'>
        {popularProducts.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            name={product.name}
            selling_price={product.selling_price}
            original_price={product.original_price}
            image={
              product.product_images && product.product_images.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL}/${product.product_images[0].image_path}`
                : `${process.env.REACT_APP_API_BASE_URL}/uploads/product_images/default-image.jpg`
            }
          />
        ))}
      </div>
    </div>
  )
}

export default Popular
