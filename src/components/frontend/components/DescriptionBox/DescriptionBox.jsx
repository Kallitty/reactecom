import React, { useEffect, useState } from 'react'
import './descriptionbox.css'
import ClipLoader from 'react-spinners/ClipLoader'

const DescriptionBox = ({ description = '', reviewCount = 0 }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [description])

  return (
    <div className='descriptionBox'>
      <div className='descriptionBox-navigator'>
        <div className='descriptionBox-nav-box'>Description</div>
        <div className='descriptionBox-nav-box fade'>
          Reviews ({reviewCount})
        </div>
      </div>
      {!loading ? (
        <div className='descriptionBox-description'>
          {description ? (
            description
              .split('\n')
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>No description available for this product.</p>
          )}
        </div>
      ) : (
        <div className='loader-overlay'>
          <ClipLoader size={50} color={'#e1356b'} loading={loading} />
        </div>
      )}
    </div>
  )
}

export default DescriptionBox
