import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { useNavigate, Link } from 'react-router-dom'
import swal from 'sweetalert'

function MyOrder() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Logic for displaying current items
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)

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

  useEffect(() => {
    let isMountered = true
    axios.get(`/api/orders`).then((res) => {
      if (isMountered) {
        if (res.data.status === 200) {
          setOrders(res.data.orders)
          setLoading(false)
        } else if (res.data.status === 404) {
          navigate('/collections')
          swal('Warning', res.data.message, 'error')
        }
      }
    })
    return () => {
      isMountered = false
    }
  }, [navigate])

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

  let displayOrders
  if (orders.length === 0) {
    // Display a message when there are no orders
    displayOrders = (
      <div className='text-center mt-5'>
        <h4>No Orders Found.</h4>
        <p>You haven't placed any orders yet. </p>
        <Link to='/collections' className='btn btn-primary mt-2'>
          Start Shopping!
        </Link>
      </div>
    )
  } else {
    displayOrders = orders.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{formatDate(item.created_at)}</td>
          <td>
            {item.firstname}
            <br />
            {item.lastname}
          </td>

          <td>{item.tracking_no}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.address}</td>
          <td>
            <Link
              to={`view-order/${item.id}`}
              className='btn btn-success btn-sm'
            >
              View
            </Link>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className='card px-4 mt-3'>
      <div className='card-header'>
        <h4>My Orders</h4>
      </div>
      <div className='card-body'>
        <div className='table-responsive'>
          {orders.length > 0 ? (
            <table className='table table-bordered table-striped'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Time</th>
                  <th>Receiver</th>
                  <th>Tracking No</th>
                  <th>Phone No</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{displayOrders}</tbody>
            </table>
          ) : (
            displayOrders
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {orders.length > 0 && (
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
      )}
    </div>
  )
}

export default MyOrder
