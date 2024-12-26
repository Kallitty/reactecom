import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

// import './order.scss' // Make sure to include the updated SCSS

function Order() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    let isMounted = true
    document.title = 'Orders'
    axios.get(`/admin/orders`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setOrders(res.data.orders)
          setLoading(false)
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Logic for displaying current items
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Function to format created_at timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: undefined,
      hour12: true,
    }).format(date)
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
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    )
  }

  // Logic for displaying page numbers
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(orders.length / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id))
  }

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageNumbers.length))
  }

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  return (
    <div className='card px-4 mt-3'>
      <div className='card-header'>
        <h4>Orders</h4>
      </div>
      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-bordered table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tracking No</th>
                <th>Phone No</th>
                <th>Email</th>
                <th>Address</th>
                <th>State</th>
                <th>Payment ID</th>
                <th>Payment Platform</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.tracking_no}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.state}</td>
                  <td>{item.payment_id}</td>
                  <td>{item.payment_mode}</td>
                  <td>{formatDate(item.created_at)}</td> {/* Format date */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className='pagination-container d-flex justify-content-center'>
          <button
            className='btn btn-outline-secondary btn-sm px-2 py-1' // Smaller size with Bootstrap classes
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
                  className='page-link btn-sm px-2 py-1' // Smaller pagination buttons
                  id={number}
                  onClick={handleClick}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
          <button
            className='btn btn-outline-secondary btn-sm px-2 py-1' // Smaller size with Bootstrap classes
            onClick={handleNext}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Order
