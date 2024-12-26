import React, { useEffect, useState } from 'react'
import './breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
import ClipLoader from 'react-spinners/ClipLoader'

const Breadcrum = ({ product }) => {
  const [loading, setLoading] = useState(true)

  // Set loading to false once the product data is available
  useEffect(() => {
    if (product?.category?.name && product.name) {
      setLoading(false)
    }
  }, [product])

  return (
    <div className='breadcrum'>
      Market <img src={arrow_icon} alt='' />
      {!loading ? (
        <>
          {product.category.name} <img src={arrow_icon} alt='' />
          {product.name}
        </>
      ) : (
        <div className='loader-overlay'>
          <ClipLoader size={50} color={'#e1356b'} loading={loading} />
        </div>
      )}
    </div>
  )
}

export default Breadcrum
