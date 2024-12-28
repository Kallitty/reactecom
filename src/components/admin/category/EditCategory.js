import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import swal from 'sweetalert'
import { ClipLoader } from 'react-spinners'

function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categoryInput, setCategory] = useState({
    slug: '',
    name: '',
    description: '',
    status: false,
    navdisplay: false,
    featured: false,
    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',
    image: null,
    error_list: {},
  })

  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    document.title = 'Edit Category'
    axios
      .get(`/api/edit-category/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCategory({
            ...res.data.category,
            image: null,
            error_list: {},
          })
          setImagePreview(res.data.category.image)
        } else if (res.data.status === 404) {
          swal('Error', res.data.message, 'error')
          navigate('/admin/view-category')
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching category:', error)
        swal('Error', 'Failed to fetch category', 'error').then(() => {
          navigate('/admin/view-category')
        })
        setLoading(false)
      })
  }, [id, navigate])

  const handleInput = (e) => {
    setCategory({
      ...categoryInput,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setCategory({
      ...categoryInput,
      image: e.target.files[0], // Store the selected file
    })
    setImagePreview(URL.createObjectURL(e.target.files[0]))
  }
  const updateCategory = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('slug', categoryInput.slug)
    formData.append('name', categoryInput.name)
    formData.append('description', categoryInput.description)
    formData.append('status', categoryInput.status ? 1 : 0)
    formData.append('navdisplay', categoryInput.navdisplay ? 1 : 0)
    formData.append('featured', categoryInput.featured ? 1 : 0)
    formData.append('meta_title', categoryInput.meta_title)
    formData.append('meta_keyword', categoryInput.meta_keyword)
    formData.append('meta_descrip', categoryInput.meta_descrip)

    if (categoryInput.image) {
      formData.append('image', categoryInput.image)
    }

    try {
      const response = await axios.post(
        `/api/update-category/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Response data:', response.data)
      setCategory({
        ...categoryInput,
        error_list: {},
      })
      swal('Success', 'Category updated successfully!', 'success').then(() => {
        navigate('/admin/view-category')
      })
    } catch (error) {
      console.error('Error:', error)
      if (error.response && error.response.status === 400) {
        setCategory({
          ...categoryInput,
          error_list: error.response.data.validation_errors,
        })
      } else {
        swal('Error', 'Failed to update category', 'error')
      }
    } finally {
      setLoading(false)
    }
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
    <div className='container px-4'>
      <div className='card mt-4'>
        <div className='card-header'>
          <h4>
            Edit Category
            <Link
              to='/admin/view-category'
              className='btn btn-primary btn-sm float-end'
            >
              Back
            </Link>
          </h4>
        </div>

        <div className='card-body'>
          <form onSubmit={updateCategory} id='CATEGORY_FORM'>
            <ul className='nav nav-tabs' id='myTab' role='tablist'>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link active'
                  id='items-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#item'
                  type='button'
                  role='tab'
                  aria-controls='item'
                  aria-selected='true'
                >
                  Items
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='profile-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#profile'
                  type='button'
                  role='tab'
                  aria-controls='profile'
                  aria-selected='false'
                >
                  Profile
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='price-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#price'
                  type='button'
                  role='tab'
                  aria-controls='price'
                  aria-selected='false'
                >
                  Other Details
                </button>
              </li>
            </ul>
            <div className='tab-content' id='myTabContent'>
              <div
                className='tab-pane card-body border fade show active'
                id='item'
                role='tabpanel'
                aria-labelledby='items-tab'
              >
                <div className='form-group mb-3'>
                  <label>Slug</label>
                  <input
                    type='text'
                    name='slug'
                    onChange={handleInput}
                    value={categoryInput.slug || ''}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {categoryInput.error_list.slug}
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label>Name</label>
                  <input
                    type='text'
                    name='name'
                    onChange={handleInput}
                    value={categoryInput.name || ''}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {categoryInput.error_list.name}
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label>Description</label>
                  <textarea
                    name='description'
                    onChange={handleInput}
                    value={categoryInput.description || ''}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>
                    {categoryInput.error_list.description}
                  </small>
                </div>

                <div className='form-group mb-3'>
                  <label>Status</label>
                  <input
                    type='checkbox'
                    name='status'
                    onChange={handleInput}
                    checked={categoryInput.status}
                    value={categoryInput.status}
                  />{' '}
                  Status Untick=shown/ Tick=hidden
                  <small className='text-danger'>
                    {categoryInput.error_list.status}
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label>NavDisplay</label>
                  <input
                    type='checkbox'
                    name='navdisplay'
                    onChange={handleInput}
                    checked={categoryInput.navdisplay}
                    value={categoryInput.navdisplay}
                  />{' '}
                  <small className='text-danger'>
                    {categoryInput.error_list.navdisplay}
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label>Featured</label>
                  <input
                    type='checkbox'
                    name='featured'
                    onChange={handleInput}
                    checked={categoryInput.featured}
                    value={categoryInput.featured}
                  />{' '}
                  <small className='text-danger'>
                    {categoryInput.error_list.featured}
                  </small>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='profile'
                role='tabpanel'
                aria-labelledby='profile-tab'
              >
                <div className='form-group mb-3'>
                  <label>Meta Title</label>
                  <input
                    type='text'
                    name='meta_title'
                    onChange={handleInput}
                    value={categoryInput.meta_title || ''}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {categoryInput.error_list.meta_title}
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label>Meta Keywords</label>
                  <textarea
                    name='meta_keyword'
                    onChange={handleInput}
                    value={categoryInput.meta_keyword || ''}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>
                    {categoryInput.error_list.meta_keyword}
                  </small>
                </div>
                {/* Image section */}
                <div className='form-group mb-3'>
                  <label>Image</label>
                  <input
                    type='file'
                    name='image'
                    onChange={handleImageChange}
                    className='form-control'
                    accept='image/*'
                  />
                  {/* Conditionally render the preview */}
                  {imagePreview ? (
                    <img
                      // Check if the preview is a URL for the new image or an existing image from the server
                      src={
                        typeof imagePreview === 'string' &&
                        imagePreview.startsWith('blob:')
                          ? imagePreview // This is a new uploaded image
                          : `http://localhost:8000/uploads/categories/${imagePreview}`
                      } // This is the existing image from the server
                      alt='Category'
                      style={{ height: '100px', marginTop: '10px' }}
                    />
                  ) : (
                    <p>No image uploaded</p>
                  )}
                  <small className='text-danger'>
                    {categoryInput.error_list.image}
                  </small>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='price'
                role='tabpanel'
                aria-labelledby='price-tab'
              >
                <div className='form-group mb-3'>
                  <label>Meta Description</label>
                  <textarea
                    name='meta_descrip'
                    onChange={handleInput}
                    value={categoryInput.meta_descrip || ''}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>
                    {categoryInput.error_list.meta_descrip}
                  </small>
                </div>
              </div>
            </div>
            <button type='submit' className='btn btn-primary px-4 float-end'>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCategory
