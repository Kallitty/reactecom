import React, { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import swal from 'sweetalert'

function Profile() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    let isMounted = true
    document.title = 'Profiles'

    axios
      .get('/users')
      .then((res) => {
        if (isMounted && res.data.users) {
          setUsers(res.data.users)
          setLoading(false)
        }
      })
      .catch(() => {
        swal('Error', 'Failed to fetch users', 'error')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleBlockUser = (id, role) => {
    if (role === 1) {
      swal('Action Denied', 'You cannot block an admin user', 'error')
      return
    }

    swal({
      title: 'Are you sure?',
      text: 'This action will block/unblock the user',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willBlock) => {
      if (willBlock) {
        axios
          .post(`/users/${id}/block`)
          .then((res) => {
            swal('Success', res.data.message, 'success')
            setUsers(
              users.map((user) =>
                user.id === id ? { ...user, status: !user.status } : user
              )
            )
          })
          .catch(() => {
            swal('Error', 'Failed to update user status', 'error')
          })
      }
    })
  }

  // Pagination Logic
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(users.length / itemsPerPage); i++) {
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

  return (
    <div className='card px-4 mt-3'>
      <div className='card-header'>
        <h4>Profile List</h4>
      </div>
      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-bordered table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role_as === 1 ? 'Admin' : 'User'}</td>
                  <td>{user.status === 1 ? 'Active' : 'Blocked'}</td>
                  <td>
                    {user.role_as === 0 && (
                      <button
                        onClick={() => handleBlockUser(user.id, user.role_as)}
                        className='btn btn-danger btn-sm'
                      >
                        {user.status === 1 ? 'Block' : 'Unblock'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
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
  )
}

export default Profile
