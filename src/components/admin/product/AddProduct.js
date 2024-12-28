import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'

function AddProduct() {
  const [categoryList, setCategoryList] = useState([])
  const [productInput, setProduct] = useState({
    category_id: '',
    slug: '',
    name: '',
    description: '',

    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',

    selling_price: '',
    original_price: '',
    qty: '',
    brand: '',
    featured: false,
    popular: false,
    status: false,
  })

  const [pictures, setPictures] = useState([])
  const [errorlist, setError] = useState([])

  const handleInput = (e) => {
    setProduct({ ...productInput, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const files = Array.from(e.target.files)

    // Prevent more than 8 images from being added
    if (pictures.length + files.length > 8) {
      swal('Error', 'You cannot upload more than 8 images', 'error')
      return
    }

    setPictures((prevPictures) => [...prevPictures, ...files])
  }

  const deleteImage = (index) => {
    const updatedPictures = [...pictures]
    updatedPictures.splice(index, 1)
    setPictures(updatedPictures)
  }

  useEffect(() => {
    document.title = 'Add Product'

    axios.get('/api/all-category').then((res) => {
      if (res.data.status === 200) {
        setCategoryList(res.data.category)
      }
    })
  }, [])

  const submitProduct = (e) => {
    e.preventDefault()

    const formData = new FormData()
    pictures.forEach((picture) => {
      formData.append('images[]', picture)
    })

    formData.append('category_id', productInput.category_id)
    formData.append('slug', productInput.slug)
    formData.append('name', productInput.name)
    formData.append('description', productInput.description)
    formData.append('meta_title', productInput.meta_title)
    formData.append('meta_keyword', productInput.meta_keyword)
    formData.append('meta_descrip', productInput.meta_descrip)
    formData.append('selling_price', productInput.selling_price)
    formData.append('original_price', productInput.original_price)
    formData.append('qty', productInput.qty)
    formData.append('brand', productInput.brand)
    formData.append('featured', productInput.featured ? 1 : 0)
    formData.append('popular', productInput.popular ? 1 : 0)
    formData.append('status', productInput.status ? 1 : 0)

    axios
      .post('/api/store-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal('Success', res.data.message, 'success')
          setError([])
          setProduct({
            category_id: '',
            slug: '',
            name: '',
            description: '',
            meta_title: '',
            meta_keyword: '',
            meta_descrip: '',
            selling_price: '',
            original_price: '',
            qty: '',
            brand: '',
            featured: false,
            popular: false,
            status: false,
          })
          setPictures([])
        } else if (res.data.status === 422) {
          swal('All fields are mandatory', '', 'error')
          setError(res.data.validation_errors)
        } else {
          swal('Uncommon error', '', 'error')
        }
      })
  }

  return (
    <div className='container-fluid px-4'>
      <div className='card mt-4'>
        <div className='card-header'>
          <h4>
            Add Product
            <Link
              to='/admin/view-product'
              className='btn btn-primary btn-sm float-end'
            >
              View Products
            </Link>
          </h4>
        </div>
        <div className='card-body'>
          <form onSubmit={submitProduct} encType='multipart/form-data'>
            <ul className='nav nav-tabs' id='myTab' role='tablist'>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link active'
                  id='home-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#home'
                  type='button'
                  role='tab'
                  aria-controls='home'
                  aria-selected='true'
                >
                  Home
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='seotags-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#seotags'
                  type='button'
                  role='tab'
                  aria-controls='seotags'
                  aria-selected='false'
                >
                  SEO Tags
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='otherdetails-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#otherdetails'
                  type='button'
                  role='tab'
                  aria-controls='otherdetails'
                  aria-selected='false'
                >
                  Other Details
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='imagedetails-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#imagedetails'
                  type='button'
                  role='tab'
                  aria-controls='imagedetails'
                  aria-selected='false'
                >
                  Images
                </button>
              </li>
            </ul>
            <div className='tab-content' id='myTabContent'>
              <div
                className='tab-pane card-body border fade show active'
                id='home'
                role='tabpanel'
                aria-labelledby='home-tab'
              >
                <div className='form-group mb-3'>
                  <label>Select Category</label>
                  <select
                    name='category_id'
                    onChange={handleInput}
                    value={productInput.category_id}
                    className='form-control'
                  >
                    <option value=''>Select Category</option>
                    {categoryList.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <small className='text-danger'>{errorlist.category_id}</small>
                </div>

                <div className='form-group mb-3'>
                  <label>Slug</label>
                  <input
                    type='text'
                    name='slug'
                    onChange={handleInput}
                    value={productInput.slug}
                    className='form-control'
                  />
                  <small className='text-danger'>{errorlist.slug}</small>
                </div>
                <div className='form-group mb-3'>
                  <label>Name</label>
                  <input
                    type='text'
                    name='name'
                    onChange={handleInput}
                    value={productInput.name}
                    className='form-control'
                  />
                  <small className='text-danger'>{errorlist.name}</small>
                </div>
                <div className='form-group mb-3'>
                  <label>Description</label>
                  <textarea
                    name='description'
                    onChange={handleInput}
                    value={productInput.description}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>{errorlist.description}</small>
                </div>
              </div>
              <div
                className='tab-pane card-body border fade'
                id='seotags'
                role='tabpanel'
                aria-labelledby='seotags-tab'
              >
                <div className='form-group mb-3'>
                  <label>Meta Title</label>
                  <input
                    type='text'
                    name='meta_title'
                    onChange={handleInput}
                    value={productInput.meta_title}
                    className='form-control'
                  />
                  <small className='text-danger'>{errorlist.meta_title}</small>
                </div>
                <div className='form-group mb-3'>
                  <label>Meta Keywords</label>
                  <textarea
                    name='meta_keyword'
                    onChange={handleInput}
                    value={productInput.meta_keyword}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>
                    {errorlist.meta_keyword}
                  </small>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='otherdetails'
                role='tabpanel'
                aria-labelledby='otherdetails-tab'
              >
                <div className='row'>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Selling Price</label>
                    <input
                      type='text'
                      name='selling_price'
                      onChange={handleInput}
                      value={productInput.selling_price}
                      className='form-control'
                    />
                    <small className='text-danger'>
                      {errorlist.selling_price}
                    </small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Original Price</label>
                    <input
                      type='text'
                      name='original_price'
                      onChange={handleInput}
                      value={productInput.original_price}
                      className='form-control'
                    />
                    <small className='text-danger'>
                      {errorlist.original_price}
                    </small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Quantity</label>
                    <input
                      type='text'
                      name='qty'
                      onChange={handleInput}
                      value={productInput.qty}
                      className='form-control'
                    />
                    <small className='text-danger'>{errorlist.qty}</small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Color and Length</label>
                    <input
                      type='text'
                      name='brand'
                      onChange={handleInput}
                      value={productInput.brand}
                      className='form-control'
                    />
                    <small className='text-danger'>{errorlist.brand}</small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Featured</label>
                    <input
                      type='checkbox'
                      name='featured'
                      onChange={(e) =>
                        setProduct({
                          ...productInput,
                          featured: e.target.checked,
                        })
                      }
                      checked={productInput.featured}
                    />
                    <small className='text-danger'>{errorlist.featured}</small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Popular</label>
                    <input
                      type='checkbox'
                      name='popular'
                      onChange={(e) =>
                        setProduct({
                          ...productInput,
                          popular: e.target.checked,
                        })
                      }
                      checked={productInput.popular}
                    />
                    <small className='text-danger'>{errorlist.popular}</small>
                  </div>
                  <div className='col-md-4 form-group mb-3'>
                    <label>Status</label>
                    <input
                      type='checkbox'
                      name='status'
                      onChange={(e) =>
                        setProduct({
                          ...productInput,
                          status: e.target.checked,
                        })
                      }
                      checked={productInput.status}
                    />
                    <small className='text-danger'>{errorlist.status}</small>
                  </div>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='imagedetails'
                role='tabpanel'
                aria-labelledby='imagedetails-tab'
              >
                <div className='form-group mb-3'>
                  <label>Images</label>
                  <input
                    type='file'
                    name='image'
                    onChange={handleImage}
                    className='form-control'
                    multiple
                  />
                  <small className='text-danger'>{errorlist.image}</small>
                  <div className='image-preview mt-3'>
                    {pictures.map((image, index) => (
                      <div
                        className='image-preview-item'
                        key={index}
                        style={{ display: 'inline-block', marginRight: '10px' }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt='Preview'
                          height='100px'
                          width='100px'
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                        <button
                          type='button'
                          onClick={() => deleteImage(index)}
                          className='btn btn-sm btn-danger mt-2'
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type='submit' className='btn btn-primary px-4 mt-2'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
