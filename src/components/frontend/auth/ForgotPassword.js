import axios from 'axios'
import React, { useState } from 'react'
import swal from 'sweetalert'
import Navbar from '../../../layouts/frontend/Navbar'
import Footer from '../components/Footer/Footer'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({}) // Clear previous errors

    axios.get('/sanctum/csrf-cookie').then(() => {
      axios
        .post('http://localhost:8000/api/password/email', { email })
        .then((response) => {
          swal('Success', response.data.message, 'success')
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          if (error.response) {
            const errorData = error.response.data
            if (error.response.status === 422) {
              setErrors(errorData.errors)
              swal(
                'Error',
                errorData.errors.email
                  ? errorData.errors.email[0]
                  : 'Validation Error',
                'error'
              )
            } else if (error.response.status === 429) {
              swal(
                'Error',
                'Too many requests. Please wait before retrying.',
                'error'
              )
            } else {
              swal('Error', errorData.message, 'error')
            }
          } else if (error.request) {
            swal('Error', 'Network error, please try again later.', 'error')
          } else {
            swal('Error', 'An unexpected error occurred.', 'error')
          }
        })
    })
  }

  return (
    <div>
      <Navbar />
      <div className='container py-5'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div
              className='card'
              style={{ border: '2px solid rgba(255, 105, 180, 0.9)' }}
            >
              <div
                className='card-header'
                style={{
                  backgroundColor: 'rgba(255, 105, 180, 0.9)',
                  color: '#fff',
                }}
              >
                <h4>Forgot Password</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit}>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Email Address
                    </label>
                    <input
                      type='email'
                      name='email'
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className='form-control'
                      required
                    />
                    {errors.email && (
                      <div className='alert alert-danger'>
                        {errors.email[0]}
                      </div>
                    )}
                  </div>
                  <div className='form-group mb-3 text-center'>
                    <button
                      type='submit'
                      className='btn'
                      disabled={loading}
                      style={{
                        backgroundColor: 'rgba(255, 105, 180, 0.9)',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '20px',
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Password Reset Link'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ForgotPassword
