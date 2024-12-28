import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import ClipLoader from 'react-spinners/ClipLoader'

function EditProduct() {
  const { id } = useParams() // Get product ID from URL
  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(true)
  const [existingImages, setExistingImages] = useState([]) // To track existing product images

  useEffect(() => {
    document.title = 'Edit Product'

    // Fetch categories
    axios.get('/api/all-category').then((res) => {
      if (res.data.status === 200) {
        setCategoryList(res.data.category)
      }
    })

    // Fetch product details for editing
    if (id) {
      axios.get(`/api/edit-product/${id}`).then((res) => {
        if (res.data.status === 200) {
          setProduct(res.data.product)
          setExistingImages(res.data.product.images) // Load existing images
        } else if (res.data.status === 404) {
          swal('Error', res.data.message, 'error')
          navigate('/admin/view-product')
        }
        setLoading(false)
      })
    }
  }, [id, navigate])

  const handleInput = (e) => {
    setProduct({ ...productInput, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const files = Array.from(e.target.files)

    // Prevent more than 8 images
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

  const deleteExistingImage = (imageId) => {
    // Remove existing image from database
    axios.delete(`/api/delete-product-image/${imageId}`).then((res) => {
      if (res.data.status === 200) {
        // swal('Success', res.data.message, 'success')
        setExistingImages(
          existingImages.filter((image) => image.id !== imageId)
        ) // Remove from state
      } else {
        swal('Error', res.data.message, 'error')
      }
    })
  }

  const updateProduct = (e) => {
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
      .post(`/api/update-product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal('Success', res.data.message, 'success')
          setError([])
          navigate('/admin/view-product')
        } else if (res.data.status === 422) {
          swal('All fields are mandatory', '', 'error')
          setError(res.data.validation_errors)
        } else {
          swal('Uncommon error', '', 'error')
        }
      })
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
  }

  return (
    <div className='container-fluid px-4'>
      <div className='card mt-4'>
        <div className='card-header'>
          <h4>
            Edit Product
            <Link
              to='/admin/view-product'
              className='btn btn-primary btn-sm float-end'
            >
              View Products
            </Link>
          </h4>
        </div>
        <div className='card-body'>
          <form onSubmit={updateProduct} encType='multipart/form-data'>
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
                  <label>Meta Keyword</label>
                  <input
                    type='text'
                    name='meta_keyword'
                    onChange={handleInput}
                    value={productInput.meta_keyword}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {errorlist.meta_keyword}
                  </small>
                </div>

                <div className='form-group mb-3'>
                  <label>Meta Description</label>
                  <textarea
                    name='meta_descrip'
                    onChange={handleInput}
                    value={productInput.meta_descrip}
                    className='form-control'
                  ></textarea>
                  <small className='text-danger'>
                    {errorlist.meta_descrip}
                  </small>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='otherdetails'
                role='tabpanel'
                aria-labelledby='otherdetails-tab'
              >
                <div className='form-group mb-3'>
                  <label>Selling Price</label>
                  <input
                    type='number'
                    name='selling_price'
                    onChange={handleInput}
                    value={productInput.selling_price}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {errorlist.selling_price}
                  </small>
                </div>

                <div className='form-group mb-3'>
                  <label>Original Price</label>
                  <input
                    type='number'
                    name='original_price'
                    onChange={handleInput}
                    value={productInput.original_price}
                    className='form-control'
                  />
                  <small className='text-danger'>
                    {errorlist.original_price}
                  </small>
                </div>

                <div className='form-group mb-3'>
                  <label>Quantity</label>
                  <input
                    type='number'
                    name='qty'
                    onChange={handleInput}
                    value={productInput.qty}
                    className='form-control'
                  />
                  <small className='text-danger'>{errorlist.qty}</small>
                </div>

                <div className='form-group mb-3'>
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

                <div className='form-check mb-3'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='featured'
                    checked={productInput.featured}
                    onChange={() =>
                      setProduct({
                        ...productInput,
                        featured: !productInput.featured,
                      })
                    }
                  />
                  <label className='form-check-label'>Featured</label>
                </div>

                <div className='form-check mb-3'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='popular'
                    checked={productInput.popular}
                    onChange={() =>
                      setProduct({
                        ...productInput,
                        popular: !productInput.popular,
                      })
                    }
                  />
                  <label className='form-check-label'>Popular</label>
                </div>

                <div className='form-check mb-3'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='status'
                    checked={productInput.status}
                    onChange={() =>
                      setProduct({
                        ...productInput,
                        status: !productInput.status,
                      })
                    }
                  />
                  <label className='form-check-label'>Status</label>
                </div>
              </div>

              <div
                className='tab-pane card-body border fade'
                id='imagedetails'
                role='tabpanel'
                aria-labelledby='imagedetails-tab'
              >
                <div className='form-group mb-3'>
                  <label>Upload Images (max 8)</label>
                  <input
                    type='file'
                    name='images[]'
                    multiple
                    className='form-control'
                    onChange={handleImage}
                  />
                  <small className='text-danger'>{errorlist.images}</small>
                </div>

                <div className='existing-images'>
                  <h5>Existing Images</h5>
                  <div className='row'>
                    {existingImages && existingImages.length > 0 ? (
                      existingImages.map((image) => (
                        <div className='col-md-3' key={image.id}>
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${image.image_path}`}
                            // ${process.env.REACT_APP_API_BASE_URL}/${img.image_path}

                            alt='Existing image'
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                            }}
                          />
                          <button
                            className='btn btn-danger btn-sm mt-1'
                            onClick={() => deleteExistingImage(image.id)}
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No existing images available.</p>
                    )}
                  </div>
                </div>

                <div className='uploaded-images'>
                  <h5>Uploaded Images</h5>
                  <div className='row'>
                    {pictures.map((picture, index) => (
                      <div className='col-md-3' key={index}>
                        <img
                          src={URL.createObjectURL(picture)}
                          alt='Upload Preview'
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                          }}
                        />
                        <button
                          className='btn btn-danger btn-sm mt-1'
                          onClick={() => deleteImage(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type='submit' className='btn btn-primary'>
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProduct

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Link, useParams, useNavigate } from 'react-router-dom'
// import swal from 'sweetalert'
// import ClipLoader from 'react-spinners/ClipLoader'

// function EditProduct() {
//   const { id } = useParams() // Use useParams to get the product ID
//   // const product_id = useParams().id
//   const navigate = useNavigate() // Use useNavigate for navigation

//   const [categoryList, setCategoryList] = useState([])
//   const [productInput, setProduct] = useState({
//     category_id: '',
//     slug: '',
//     name: '',
//     description: '',
//     meta_title: '',
//     meta_keyword: '',
//     meta_descrip: '',
//     selling_price: '',
//     original_price: '',
//     qty: '',
//     brand: '',
//     featured: false,
//     popular: false,
//     status: false,
//   })

//   const [picture, setPicture] = useState(null)
//   const [errorlist, setError] = useState({})
//   const [loading, setLoading] = useState(true)

//   const handleInput = (e) => {
//     setProduct({ ...productInput, [e.target.name]: e.target.value })
//   }

//   const handleImage = (e) => {
//     setPicture(e.target.files[0])
//     console.log(e.target.files[0])
//   }

//   useEffect(() => {
//     document.title = 'Edit Product'

//     axios.get('/api/all-category').then((res) => {
//       if (res.data.status === 200) {
//         setCategoryList(res.data.category)
//       }
//     })

//     if (id) {
//       axios.get(`/api/edit-product/${id}`).then((res) => {
//         if (res.data.status === 200) {
//           console.log(res.data)
//           setProduct(res.data.product)
//         } else if (res.data.status === 404) {
//           swal('Error', res.data.message, 'error')
//           navigate('/admin/view-product')
//         }
//         setLoading(false)
//       })
//     }
//   }, [id, navigate])

//   const updateProduct = (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     if (picture) {
//       formData.append('image', picture)
//     }

//     formData.append('category_id', productInput.category_id)
//     formData.append('slug', productInput.slug)
//     formData.append('name', productInput.name)
//     formData.append('description', productInput.description)
//     formData.append('meta_title', productInput.meta_title)
//     formData.append('meta_keyword', productInput.meta_keyword)
//     formData.append('meta_descrip', productInput.meta_descrip)
//     formData.append('selling_price', productInput.selling_price)
//     formData.append('original_price', productInput.original_price)
//     formData.append('qty', productInput.qty)
//     formData.append('brand', productInput.brand)
//     formData.append('featured', productInput.featured ? 1 : 0)
//     formData.append('popular', productInput.popular ? 1 : 0)
//     formData.append('status', productInput.status ? 1 : 0)

//     axios
//       .post(`/api/update-product/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then((res) => {
//         if (res.data.status === 200) {
//           swal('Success', res.data.message, 'success')
//           setError([])
//         } else if (res.data.status === 422) {
//           swal('All fields are mandatory', '', 'error')
//           setError(res.data.errors)
//         } else {
//           swal('Uncommon error', '', 'error')
//         }
//       })
//   }
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
//   }
//   return (
//     <div className='container-fluid px-4'>
//       <div className='card mt-4'>
//         <div className='card-header'>
//           <h4>
//             Edit Product
//             <Link
//               to='/admin/view-product'
//               className='btn btn-primary btn-sm float-end'
//             >
//               View Products
//             </Link>
//           </h4>
//         </div>
//         <div className='card-body'>
//           <form onSubmit={updateProduct} encType='multipart/form-data'>
//             <ul className='nav nav-tabs' id='myTab' role='tablist'>
//               <li className='nav-item' role='presentation'>
//                 <button
//                   className='nav-link active'
//                   id='home-tab'
//                   data-bs-toggle='tab'
//                   data-bs-target='#home'
//                   type='button'
//                   role='tab'
//                   aria-controls='home'
//                   aria-selected='true'
//                 >
//                   Home
//                 </button>
//               </li>
//               <li className='nav-item' role='presentation'>
//                 <button
//                   className='nav-link'
//                   id='seotags-tab'
//                   data-bs-toggle='tab'
//                   data-bs-target='#seotags'
//                   type='button'
//                   role='tab'
//                   aria-controls='seotags'
//                   aria-selected='false'
//                 >
//                   SEO Tags
//                 </button>
//               </li>
//               <li className='nav-item' role='presentation'>
//                 <button
//                   className='nav-link'
//                   id='otherdetails-tab'
//                   data-bs-toggle='tab'
//                   data-bs-target='#otherdetails'
//                   type='button'
//                   role='tab'
//                   aria-controls='otherdetails'
//                   aria-selected='false'
//                 >
//                   Other Details
//                 </button>
//               </li>
//             </ul>
//             <div className='tab-content' id='myTabContent'>
//               <div
//                 className='tab-pane card-body border fade show active'
//                 id='home'
//                 role='tabpanel'
//                 aria-labelledby='home-tab'
//               >
//                 <div className='form-group mb-3'>
//                   <label>Select Category</label>

//                   {productInput && (
//                     <select
//                       name='category_id'
//                       onChange={handleInput}
//                       value={productInput.category_id}
//                       className='form-control'
//                     >
//                       <option value=''>Select Category</option>
//                       {categoryList.map((item) => (
//                         <option value={item.id} key={item.id}>
//                           {item.name}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                   <small className='text-danger'>{errorlist.category_id}</small>
//                 </div>

//                 <div className='form-group mb-3'>
//                   <label>Slug</label>
//                   <input
//                     type='text'
//                     name='slug'
//                     onChange={handleInput}
//                     value={productInput.slug}
//                     className='form-control'
//                   />
//                   <small className='text-danger'>{errorlist.slug}</small>
//                 </div>
//                 <div className='form-group mb-3'>
//                   <label>Name</label>
//                   <input
//                     type='text'
//                     name='name'
//                     onChange={handleInput}
//                     value={productInput.name}
//                     className='form-control'
//                   />
//                   <small className='text-danger'>{errorlist.name}</small>
//                 </div>
//                 <div className='form-group mb-3'>
//                   <label>Description</label>
//                   <textarea
//                     name='description'
//                     onChange={handleInput}
//                     value={productInput.description}
//                     className='form-control'
//                   ></textarea>
//                   <small className='text-danger'>{errorlist.description}</small>
//                 </div>
//               </div>
//               <div
//                 className='tab-pane card-body border fade'
//                 id='seotags'
//                 role='tabpanel'
//                 aria-labelledby='seotags-tab'
//               >
//                 <div className='form-group mb-3'>
//                   <label>Meta Title</label>
//                   <input
//                     type='text'
//                     name='meta_title'
//                     onChange={handleInput}
//                     value={productInput.meta_title}
//                     className='form-control'
//                   />
//                   <small className='text-danger'>{errorlist.meta_title}</small>
//                 </div>
//                 <div className='form-group mb-3'>
//                   <label>Meta Keywords</label>
//                   <textarea
//                     name='meta_keyword'
//                     onChange={handleInput}
//                     value={productInput.meta_keyword}
//                     className='form-control'
//                   ></textarea>
//                   <small className='text-danger'>
//                     {errorlist.meta_keyword}
//                   </small>
//                 </div>
//               </div>

//               <div
//                 className='tab-pane card-body border fade'
//                 id='otherdetails'
//                 role='tabpanel'
//                 aria-labelledby='otherdetails-tab'
//               >
//                 <div className='row'>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Selling Price</label>
//                     <input
//                       type='text'
//                       name='selling_price'
//                       onChange={handleInput}
//                       value={productInput.selling_price}
//                       className='form-control'
//                     />
//                     <small className='text-danger'>
//                       {errorlist.selling_price}
//                     </small>
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Original Price</label>
//                     <input
//                       type='text'
//                       name='original_price'
//                       onChange={handleInput}
//                       value={productInput.original_price}
//                       className='form-control'
//                     />
//                     <small className='text-danger'>
//                       {errorlist.original_price}
//                     </small>
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Quantity</label>
//                     <input
//                       type='text'
//                       name='qty'
//                       onChange={handleInput}
//                       value={productInput.qty}
//                       className='form-control'
//                     />
//                     <small className='text-danger'>{errorlist.qty}</small>
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Brand</label>
//                     <input
//                       type='text'
//                       name='brand'
//                       onChange={handleInput}
//                       value={productInput.brand}
//                       className='form-control'
//                     />
//                     <small className='text-danger'>{errorlist.brand}</small>
//                   </div>
//                   <div className='col-md-8 form-group mb-3'>
//                     <label>Image</label>
//                     <input
//                       type='file'
//                       name='image'
//                       onChange={handleImage}
//                       className='form-control'
//                     />
//                     <small className='text-danger'>{errorlist.image}</small>
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Featured</label>
//                     <input
//                       type='checkbox'
//                       name='featured'
//                       onChange={(e) =>
//                         setProduct({
//                           ...productInput,
//                           featured: e.target.checked,
//                         })
//                       }
//                       checked={productInput.featured}
//                       className='w-50 h-50'
//                     />
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Popular</label>
//                     <input
//                       type='checkbox'
//                       name='popular'
//                       onChange={(e) =>
//                         setProduct({
//                           ...productInput,
//                           popular: e.target.checked,
//                         })
//                       }
//                       checked={productInput.popular}
//                       className='w-50 h-50'
//                     />
//                   </div>
//                   <div className='col-md-4 form-group mb-3'>
//                     <label>Status</label>
//                     <input
//                       type='checkbox'
//                       name='status'
//                       onChange={(e) =>
//                         setProduct({
//                           ...productInput,
//                           status: e.target.checked,
//                         })
//                       }
//                       checked={productInput.status}
//                       className='w-50 h-50'
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <button type='submit' className='btn btn-primary px-4 mt-2'>
//               Update
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditProduct
