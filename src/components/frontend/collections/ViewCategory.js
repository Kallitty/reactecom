import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ClipLoader } from 'react-spinners'
import { Link } from 'react-router-dom'

function ViewCategory() {
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState([])

  useEffect(() => {
    let isMountered = true
    axios.get(`/getCategory`).then((res) => {
      if (isMountered) {
        if (res.data.status === 200) {
          setCategory(res.data.category)
          setLoading(false)
        }
      }
    })
    return () => {
      isMountered = false
    }
  }, [])

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
  } else {
    var showCategoryList = ''
    showCategoryList = category.map((item, idx) => {
      return (
        <div className='col-md-3' key={idx}>
          <div className='card'>
            <div className='card-body'>
              <span className='text-white'>
                <Link className='nav-link' to={`/collections/${item.slug}`}>
                  {/* Set the image path */}
                  <img
                    src={`http://localhost:8000/uploads/categories/${item.image}`}
                    className='w-100'
                    alt={item.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />

                  <h5 className='text-dark'>{item.name}</h5>
                </Link>
              </span>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div>
      <div className='py-3 bg-warning'>
        <div className='container'>
          <div className='row'>
            <h6>Category Page</h6>
          </div>
        </div>
      </div>

      <div className='py-3'>
        <div className='container'>
          <div className='row'>{showCategoryList}</div>
        </div>
      </div>
    </div>
  )
}

export default ViewCategory
