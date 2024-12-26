import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './marketcategory.css'
import dropdown_icon from '../components/Assets/dropdown_icon.png'
import Item from '../components/Item/Item'
import ClipLoader from 'react-spinners/ClipLoader'

const MarketCategory = (props) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true) // Loading state

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/products/${props.category}`)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [props.category])

  return (
    <div className='market-category'>
      {loading && (
        <div className='loading-overlay'>
          <ClipLoader size={50} color={' #e1356b'} loading={loading} />
        </div>
      )}
      <img className='marketCategory-banner' src={props.banner} alt='' />
      <div className='marketCategory-indexSort'>
        <p>
          <span>Showing 1-12</span> out of {products.length} products
        </p>
        <div className='marketCategory-short'>
          sort by <img src={dropdown_icon} alt='' />
        </div>
      </div>
      <div className='marketCategory-products'>
        {products.map((item, i) => {
          const firstImage =
            item.images && item.images.length > 0
              ? `http://localhost:8000/${item.images[0].image_path}`
              : 'http://localhost:8000/uploads/product_image/default-image.jpg'

          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={firstImage}
              selling_price={item.selling_price}
              original_price={item.original_price}
            />
          )
        })}
      </div>
      <div className='marketCategory-loadMore'>explore more</div>
    </div>
  )
}

export default MarketCategory
