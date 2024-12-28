import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

function ViewProduct() {
  const [loading, setLoading] = useState(true)
  const [viewProduct, setProduct] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    document.title = 'View Products'

    axios.get('/api/view-product').then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.products)
        setLoading(false)
      }
    })
  }, [])

  // Logic for displaying current items
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = viewProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  // Logic for displaying page numbers
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(viewProduct.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id))
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageNumbers.length))
    window.scrollTo(0, 0)
  }

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    window.scrollTo(0, 0)
  }

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
        <ClipLoader size={20} color={'#123abd'} loading={loading} />
      </div>
    )
  } else {
    const display_Productdata = currentProducts.map((item) => {
      const categoryName = item.category ? item.category.name : 'No Category'
      const ProdStatus = item.status == '0' ? 'Shown' : 'Hidden'

      const productImages =
        item.images.length > 0 ? (
          item.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8000/${img.image_path}`}
              width='50px'
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src = '' // Replace with your broken image placeholder path
              }}
            />
          ))
        ) : (
          <img src='' width='50px' alt='No Image' />
        )

      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{categoryName}</td>
          <td>{item.name}</td>
          <td>{item.selling_price}</td>
          <td>{item.original_price}</td>
          <td>{productImages}</td>
          <td>
            <Link
              to={`/admin/edit-product/${item.id}`}
              className='btn btn-success btn-sm'
            >
              Edit
            </Link>
          </td>
          <td>
            <button type='button' className='btn btn-primary btn-sm'>
              {ProdStatus}
            </button>
          </td>
          <td>
            <button type='button' className='btn btn-danger btn-sm'>
              Delete
            </button>
          </td>
        </tr>
      )
    })

    return (
      <div className='container-fluid px-4'>
        <div className='card mt-4'>
          <div className='card-header'>
            <h4>
              View Products
              <Link
                to='/admin/add-product'
                className='btn btn-primary btn-sm float-end'
              >
                Add Products
              </Link>
            </h4>
          </div>
          <div className='card-body'>
            <div className='table-responsive'>
              <table className='table table-bordered table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Product Name</th>
                    <th>Selling Price</th>
                    <th>Original Price</th>
                    <th>Images</th>
                    <th>Edit</th>
                    <th>Status</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{display_Productdata}</tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className='pagination-container d-flex justify-content-center'>
              <button
                className='btn btn-outline-secondary btn-sm px-2 py-1'
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <ul className='pagination mx-2'>
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      currentPage === number ? 'active' : ''
                    }`}
                  >
                    <button
                      className='page-link btn-sm px-2 py-1'
                      id={number}
                      onClick={handleClick}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className='btn btn-outline-secondary btn-sm px-2 py-1'
                onClick={handleNext}
                disabled={currentPage === pageNumbers.length}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewProduct

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import swal from 'sweetalert'
// import { ClipLoader } from 'react-spinners'

// function ViewProduct() {
//   const [loading, setLoading] = useState(true)
//   const [viewProduct, setProduct] = useState([])

//   useEffect(() => {
//     document.title = 'View Product'

//     axios.get('/api/view-product').then((res) => {
//       if (res.data.status === 200) {
//         setProduct(res.data.products)
//         setLoading(false)
//       }
//     })
//   }, [])

//   var ProdStatus = ''
//   var display_Productdata = ''
//   if (loading) {
//     return (
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '100vh',
//         }}
//       >
//         <ClipLoader size={20} color={'#123abd'} loading={loading} />
//       </div>
//     )
//   } else {
//     display_Productdata = viewProduct.map((item) => {
//       // Handle cases where category might be null or undefined
//       const categoryName = item.category ? item.category.name : 'No Category'

//       if (item.status == '0') {
//         ProdStatus = 'Shown'
//       } else if (item.status == '1') {
//         ProdStatus = 'Hidden'
//       }

//       return (
//         <tr key={item.id}>
//           <td>{item.id}</td>
//           <td>{categoryName}</td>
//           <td>{item.name}</td>
//           <td>{item.selling_price}</td>
//           <td>{item.original_price}</td>
//           <td>
//             <img
//               src={`http://localhost:8000/${item.image}`}
//               width='50px'
//               alt={item.name}
//             />
//           </td>
//           <td>
//             <Link
//               to={`/admin/edit-product/${item.id}`}
//               className='btn btn-success btn-sm'
//             >
//               Edit
//             </Link>
//           </td>
//           <td>
//             <button type='button' className='btn btn-primary btn-sm'>
//               {ProdStatus}
//             </button>
//           </td>
//           <td>
//             <button type='button' className='btn btn-danger btn-sm'>
//               Delete
//             </button>
//           </td>
//         </tr>
//       )
//     })
//   }

//   return (
//     <div className='container-fluid px-4'>
//       <div className='card mt-4'>
//         <div className='card-header'>
//           <h4>
//             View Products
//             <Link
//               to='/admin/add-product'
//               className='btn btn-primary btn-sm float-end'
//             >
//               Add Products
//             </Link>
//           </h4>
//         </div>
//         <div className='card-body'>
//           <div className='table-responsive'>
//             <table className='table table-bordered table-striped'>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Category Name</th>
//                   <th>Product Name</th>
//                   <th>Selling Price</th>
//                   <th>Original Price</th>
//                   <th>Image</th>
//                   <th>Edit</th>
//                   <th>Status</th>
//                   <th>Delete</th>
//                 </tr>
//               </thead>
//               <tbody>{display_Productdata}</tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ViewProduct
