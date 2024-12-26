import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import Navbar from '../../../layouts/frontend/Navbar'
import Footer from '../components/Footer/Footer'

function PasswordReset() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [passwordInput, setPasswordInput] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    error_list: {},
  })

  const handleInput = (e) => {
    e.persist()
    setPasswordInput({ ...passwordInput, [e.target.name]: e.target.value })
  }

  const resetSubmit = (e) => {
    e.preventDefault()

    const data = {
      email: passwordInput.email,
      password: passwordInput.password,
      password_confirmation: passwordInput.password_confirmation,
      token: token,
    }

    axios.get('/sanctum/csrf-cookie').then((response) => {
      axios
        .post('http://localhost:8000/api/password/reset', data)
        .then((res) => {
          if (res.status === 200) {
            swal('Success', res.data.message, 'success')
            navigate('/login')
          } else {
            setPasswordInput({
              ...passwordInput,
              error_list: res.data.validation_errors,
            })
          }
        })
        .catch((error) => {
          console.error(
            'There was an error with the password reset request!',
            error
          )
          if (error.response) {
            if (error.response.data.errors) {
              setPasswordInput({
                ...passwordInput,
                error_list: error.response.data.errors,
              })
              swal(
                'Error',
                Object.values(error.response.data.errors).flat().join(', '),
                'error'
              )
            } else {
              swal('Error', error.response.data.message, 'error')
            }
          } else if (error.request) {
            swal('Error', 'No response received from the server.', 'error')
          } else {
            swal(
              'Error',
              'An error occurred while setting up the request.',
              'error'
            )
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
                <h4>Reset Password</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={resetSubmit}>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      onChange={handleInput}
                      value={passwordInput.email}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {passwordInput.error_list.email}
                    </span>
                  </div>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      New Password
                    </label>
                    <input
                      type='password'
                      name='password'
                      onChange={handleInput}
                      value={passwordInput.password}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {passwordInput.error_list.password}
                    </span>
                  </div>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Confirm Password
                    </label>
                    <input
                      type='password'
                      name='password_confirmation'
                      onChange={handleInput}
                      value={passwordInput.password_confirmation}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {passwordInput.error_list.password_confirmation}
                    </span>
                  </div>
                  <div className='form-group mb-3 text-center'>
                    <button
                      type='submit'
                      className='btn'
                      style={{
                        backgroundColor: 'rgba(255, 105, 180, 0.9)',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '20px',
                      }}
                    >
                      Reset Password
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

export default PasswordReset
