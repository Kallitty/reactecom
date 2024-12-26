import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Item from '../Item/Item'
import './newcollections.css'
import ClipLoader from 'react-spinners/ClipLoader'

const NewCollections = () => {
  const [newCollections, setNewCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/new-collections')
      .then((res) => {
        if (res.data.status === 200) {
          setNewCollections(res.data.newCollections)
        }
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className='loading-overlay'>
        <ClipLoader size={50} color={'#e1356b'} loading={loading} />
      </div>
    )
  }
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className='collections'>
        {newCollections.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            name={product.name}
            selling_price={product.selling_price}
            original_price={product.original_price}
            image={
              product.product_images && product.product_images.length > 0
                ? `http://localhost:8000/${product.product_images[0].image_path}`
                : 'http://localhost:8000/uploads/product_images/default-image.jpg'
            }
          />
        ))}
      </div>
    </div>
  )
}

export default NewCollections
