import React, { useEffect, useState } from 'react'
import './item.css'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Item = (props) => {
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState([])
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState({})
  const navigate = useNavigate()
  const { slug } = useParams()

  // Format prices with commas
  const formattedSellingPrice = Number(props.selling_price).toLocaleString()
  const formattedOriginalPrice = Number(props.original_price).toLocaleString()

  return (
    <div className='item'>
      {/* <Link to={`/${category.slug}/${product.slug}`}> */}
      <Link to={`/product/${props.id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={props.image}
          alt='-product-'
        />
      </Link>
      <p>{props.name}</p>
      <div className='item-prices'>
        <div className='item-selling-price'>₦{formattedSellingPrice}</div>
        <div className='item-original-price'>₦{formattedOriginalPrice}</div>
      </div>
    </div>
  )
}

export default Item
