import axios from 'axios'
import React, { useState } from 'react'
import swal from 'sweetalert'
import { ClipLoader } from 'react-spinners'

function Category() {
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
    image: null, // New state for image file
    error_list: {},
  })

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target
    setCategory({
      ...categoryInput,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // New function to handle file input change
  const handleImageChange = (e) => {
    setCategory({
      ...categoryInput,
      image: e.target.files[0], // Set the selected file
    })
  }

  const submitCategory = (e) => {
    e.preventDefault()

    // Create a FormData object to handle file upload
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
    formData.append('image', categoryInput.image) // Append the image

    axios
      .post(`/store-category`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          document.getElementById('CATEGORY_FORM').reset()
          swal('Success.', res.data.message, 'success')
          setCategory({
            slug: '',
            name: '',
            description: '',
            status: false,
            navdisplay: false,
            featured: false,
            meta_title: '',
            meta_keyword: '',
            meta_descrip: '',
            image: null, // Reset the image
            error_list: {},
          })
        } else if (res.data.status === 422) {
          setCategory({
            ...categoryInput,
            error_list: res.data.validation_errors,
          })
        }
      })
  }

  return (
    <div className='container-fluid px-4'>
      <h1 className='mt-4'>Add Category</h1>
      <form onSubmit={submitCategory} id='CATEGORY_FORM'>
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
                value={categoryInput.slug}
                className='form-control'
              />
              {categoryInput.error_list.slug && (
                <small className='text-danger'>
                  {categoryInput.error_list.slug}
                </small>
              )}
            </div>
            <div className='form-group mb-3'>
              <label>Name</label>
              <input
                type='text'
                name='name'
                onChange={handleInput}
                value={categoryInput.name}
                className='form-control'
              />
              {categoryInput.error_list.name && (
                <small className='text-danger'>
                  {categoryInput.error_list.name}
                </small>
              )}
            </div>
            <div className='form-group mb-3'>
              <label>Description</label>
              <textarea
                name='description'
                onChange={handleInput}
                value={categoryInput.description}
                className='form-control'
              ></textarea>
            </div>
            <div className='form-group mb-3'>
              <label>Status</label>
              <input
                type='checkbox'
                name='status'
                onChange={handleInput}
                checked={categoryInput.status}
              />
              {''} Untick=shown/ Tick=hidden
            </div>
            <div className='form-group mb-3'>
              <label>NavDisplay</label>
              <input
                type='checkbox'
                name='navdisplay'
                onChange={handleInput}
                checked={categoryInput.navdisplay}
              />
              {''}
            </div>
            <div className='form-group mb-3'>
              <label>Featured</label>
              <input
                type='checkbox'
                name='featured'
                onChange={handleInput}
                checked={categoryInput.featured}
              />
              {''}
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
                value={categoryInput.meta_title}
                className='form-control'
              />
              {categoryInput.error_list.meta_title && (
                <small className='text-danger'>
                  {categoryInput.error_list.meta_title}
                </small>
              )}
            </div>
            <div className='form-group mb-3'>
              <label>Meta Keywords</label>
              <textarea
                name='meta_keyword'
                onChange={handleInput}
                value={categoryInput.meta_keyword}
                className='form-control'
              ></textarea>
              {categoryInput.error_list.meta_keyword && (
                <small className='text-danger'>
                  {categoryInput.error_list.meta_keyword}
                </small>
              )}
            </div>
            <div className='form-group mb-3'>
              <label>Image</label>
              <input
                type='file'
                name='image'
                onChange={handleImageChange} // Handle image change
                className='form-control'
                accept='image/*' // Accept only image files
              />
              {categoryInput.error_list.image && (
                <small className='text-danger'>
                  {categoryInput.error_list.image}
                </small>
              )}
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
                value={categoryInput.meta_descrip}
                className='form-control'
              ></textarea>
              {categoryInput.error_list.meta_descrip && (
                <small className='text-danger'>
                  {categoryInput.error_list.meta_descrip}
                </small>
              )}
            </div>
          </div>
        </div>
        <button type='submit' className='btn btn-primary px-4 float-end'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Category

// import axios from 'axios'
// import React, { useState } from 'react'
// import swal from 'sweetalert'
// import { ClipLoader } from 'react-spinners'

// function Category() {
//   const [categoryInput, setCategory] = useState({
//     slug: '',
//     name: '',
//     description: '',
//     status: false, // Change to boolean for checkbox handling
//     meta_title: '',
//     meta_keyword: '',
//     meta_descrip: '',
//     error_list: {}, // Changed to an object to hold errors for individual fields
//   })

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target
//     setCategory({
//       ...categoryInput,
//       [name]: type === 'checkbox' ? checked : value, // Handle checkbox input
//     })
//   }

//   const submitCategory = (e) => {
//     e.preventDefault()

//     const data = {
//       slug: categoryInput.slug,
//       name: categoryInput.name,
//       description: categoryInput.description, // Changed to description
//       status: categoryInput.status ? 1 : 0, // Convert checkbox to integer
//       meta_title: categoryInput.meta_title,
//       meta_keyword: categoryInput.meta_keyword,
//       meta_descrip: categoryInput.meta_descrip,
//     }

//     axios.post(`/store-category`, data).then((res) => {
//       if (res.data.status === 200) {
//         document.getElementById('CATEGORY_FORM').reset()
//         swal('Success.', res.data.message, 'success')
//         setCategory({
//           slug: '',
//           name: '',
//           description: '',
//           status: false,
//           meta_title: '',
//           meta_keyword: '',
//           meta_descrip: '',
//           error_list: {},
//         })
//       } else if (res.data.status === 422) {
//         setCategory({
//           ...categoryInput,
//           error_list: res.data.validation_errors,
//         })
//       }
//     })
//   }

//   return (
//     <div className='container-fluid px-4'>
//       <h1 className='mt-4'>Add Category</h1>
//       <form onSubmit={submitCategory} id='CATEGORY_FORM'>
//         <ul className='nav nav-tabs' id='myTab' role='tablist'>
//           <li className='nav-item' role='presentation'>
//             <button
//               className='nav-link active'
//               id='items-tab'
//               data-bs-toggle='tab'
//               data-bs-target='#item'
//               type='button'
//               role='tab'
//               aria-controls='item'
//               aria-selected='true'
//             >
//               Items
//             </button>
//           </li>
//           <li className='nav-item' role='presentation'>
//             <button
//               className='nav-link'
//               id='profile-tab'
//               data-bs-toggle='tab'
//               data-bs-target='#profile'
//               type='button'
//               role='tab'
//               aria-controls='profile'
//               aria-selected='false'
//             >
//               Profile
//             </button>
//           </li>
//           <li className='nav-item' role='presentation'>
//             <button
//               className='nav-link'
//               id='price-tab'
//               data-bs-toggle='tab'
//               data-bs-target='#price'
//               type='button'
//               role='tab'
//               aria-controls='price'
//               aria-selected='false'
//             >
//               Price
//             </button>
//           </li>
//         </ul>
//         <div className='tab-content' id='myTabContent'>
//           <div
//             className='tab-pane card-body border fade show active'
//             id='item'
//             role='tabpanel'
//             aria-labelledby='items-tab'
//           >
//             <div className='form-group mb-3'>
//               <label>Slug</label>
//               <input
//                 type='text'
//                 name='slug'
//                 onChange={handleInput}
//                 value={categoryInput.slug}
//                 className='form-control'
//               />
//               {categoryInput.error_list.slug && (
//                 <small className='text-danger'>
//                   {categoryInput.error_list.slug}
//                 </small>
//               )}
//             </div>
//             <div className='form-group mb-3'>
//               <label>Name</label>
//               <input
//                 type='text'
//                 name='name'
//                 onChange={handleInput}
//                 value={categoryInput.name}
//                 className='form-control'
//               />
//               {categoryInput.error_list.name && (
//                 <small className='text-danger'>
//                   {categoryInput.error_list.name}
//                 </small>
//               )}
//             </div>
//             <div className='form-group mb-3'>
//               <label>Description</label>
//               <textarea
//                 name='description'
//                 onChange={handleInput}
//                 value={categoryInput.description}
//                 className='form-control'
//               ></textarea>
//             </div>
//             <div className='form-group mb-3'>
//               <label>Status</label>
//               <input
//                 type='checkbox'
//                 name='status'
//                 onChange={handleInput}
//                 checked={categoryInput.status}
//               />
//               {''} Status 0=shown/ 1=hidden
//             </div>
//           </div>

//           <div
//             className='tab-pane card-body border fade'
//             id='profile'
//             role='tabpanel'
//             aria-labelledby='profile-tab'
//           >
//             <div className='form-group mb-3'>
//               <label>Meta Title</label>
//               <input
//                 type='text'
//                 name='meta_title'
//                 onChange={handleInput}
//                 value={categoryInput.meta_title}
//                 className='form-control'
//               />
//               {categoryInput.error_list.meta_title && (
//                 <small className='text-danger'>
//                   {categoryInput.error_list.meta_title}
//                 </small>
//               )}
//             </div>
//             <div className='form-group mb-3'>
//               <label>Meta Keywords</label>
//               <textarea
//                 name='meta_keyword'
//                 onChange={handleInput}
//                 value={categoryInput.meta_keyword}
//                 className='form-control'
//               ></textarea>
//             </div>
//           </div>

//           <div
//             className='tab-pane card-body border fade'
//             id='price'
//             role='tabpanel'
//             aria-labelledby='price-tab'
//           >
//             <div className='form-group mb-3'>
//               <label>Meta Description</label>
//               <textarea
//                 name='meta_descrip'
//                 onChange={handleInput}
//                 value={categoryInput.meta_descrip}
//                 className='form-control'
//               ></textarea>
//             </div>
//           </div>
//         </div>
//         <button type='submit' className='btn btn-primary px-4 float-end'>
//           Submit
//         </button>
//       </form>
//     </div>
//   )
// }

// export default Category
