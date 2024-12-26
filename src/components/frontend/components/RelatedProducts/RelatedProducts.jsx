import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Item from '../Item/Item'
import './relatedproducts.css'
import ClipLoader from 'react-spinners/ClipLoader'

const RelatedProducts = ({ currentProductCategoryId, productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentProductCategoryId && productId) {
      axios
        .get(`/related-products/${currentProductCategoryId}/${productId}`)
        .then((res) => {
          if (res.data.status === 200) {
            setRelatedProducts(res.data.relatedProducts)
          }
        })
        .catch((error) => {
          console.error('Error fetching related products:', error)
        })
        .finally(() => setLoading(false))
    }
  }, [currentProductCategoryId, productId])

  if (loading) {
    return (
      <div className='loading-overlay'>
        <ClipLoader size={50} color={'#e1356b'} loading={loading} />
      </div>
    )
  }

  return (
    <div className='RelatedProducts'>
      <h3>Related Products</h3>
      <hr />
      <div className='relatedProducts-item'>
        {relatedProducts.map((product) => (
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

export default RelatedProducts

// import React from 'react'
// import './relatedproducts.css'
// import data_product from '../Assets/data'
// import Item from '../Item/Item'

// const RelatedProducts = () => {
//   return (
//     <div className='RelatedProducts'>
//       <h1>Related Product</h1>
//       <hr />
//       <div className='relatedProducts-item'>
//         {data_product.map((item, i) => {
//           return (
//             <Item
//               key={i}
//               id={item.id}
//               name={item.name}
//               image={item.image}

//               new_price={item.new_price}
//               old_price={item.old_price}
//             />
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default RelatedProducts
