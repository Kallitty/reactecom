import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { ClipLoader } from 'react-spinners'

function ViewCategory() {
  const [loading, setLoading] = useState(true)
  const [categoryList, setCategoryList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    axios
      .get('/api/view-category')
      .then((res) => {
        if (res.data.status === 200) {
          setCategoryList(res.data.category)
        }
        setLoading(false)
      })
      .catch((error) => {
        swal('Error', 'Failed to fetch categories', 'error')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`/api/delete-category/${id}`)
          // Filter out the deleted category from the state
          setCategoryList(categoryList.filter((category) => category.id !== id))
          swal('Poof! Your data has been deleted!', {
            icon: 'success',
          })
        } catch (error) {
          console.error('Error deleting data:', error)
          swal('Error', 'Failed to delete data', 'error')
        }
      }
    })
  }

  // Logic for displaying current categories
  const indexOfLastCategory = currentPage * itemsPerPage
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage
  const currentCategories = categoryList.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  )

  // Logic for displaying page numbers
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(categoryList.length / itemsPerPage); i++) {
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
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    )
  }

  const viewCategoryHTMLTable = currentCategories.map((item) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.slug}</td>
      <td>{item.status}</td>
      <td>{item.navdisplay}</td>
      <td>{item.featured}</td>
      <td>
        <Link
          to={`/admin/edit-category/${item.id}`}
          className='btn btn-success btn-sm'
        >
          Edit
        </Link>
      </td>
      <td>
        <button
          onClick={() => handleDelete(item.id)}
          type='button'
          className='btn btn-danger btn-sm'
        >
          Delete
        </button>
      </td>
    </tr>
  ))

  return (
    <div className='container px-4'>
      <div className='card mt-4'>
        <div className='card-header'>
          <h4>
            Category List
            <Link
              to='/admin/category'
              className='btn btn-primary btn-sm float-end'
            >
              Add Category
            </Link>
          </h4>
        </div>
        <div className='card-body'>
          <table className='table table-bordered table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>NavDisplay</th>
                <th>Featured</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{viewCategoryHTMLTable}</tbody>
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

export default ViewCategory
