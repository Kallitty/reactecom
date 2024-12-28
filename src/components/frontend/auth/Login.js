import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../../layouts/frontend/Navbar'
import swal from 'sweetalert'
import Footer from '../components/Footer/Footer'

export default function Login() {
  const navigate = useNavigate()

  const [loginInput, setLogin] = useState({
    email: '',
    password: '',
    error_list: {},
  })

  const handleInput = (e) => {
    e.persist()
    setLogin({ ...loginInput, [e.target.name]: e.target.value })
  }

  const loginSubmit = (e) => {
    e.preventDefault()

    const data = {
      email: loginInput.email,
      password: loginInput.password,
    }

    axios.get('/sanctum/csrf-cookie').then((response) => {
      axios
        .post(`/api/login`, data)
        .then((res) => {
          if (res.data.status === 200) {
            localStorage.setItem('auth_token', res.data.token)
            localStorage.setItem('auth_username', res.data.username)
            swal('Success.', res.data.message, 'success')
            if (res.data.role === 'admin') {
              navigate('/admin/dashboard')
            } else {
              navigate('/')
            }
          } else if (res.data.status === 401 || res.data.status === 403) {
            swal('Warning.', res.data.message, 'warning')
          } else {
            setLogin({ ...loginInput, error_list: res.data.validation_errors })
          }
        })
        .catch((error) => {
          console.error('There was an error with the login request!', error)
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
              style={{ border: '2px solid rgba(255, 105, 180, 0.9)' }} // Slightly bolder pink for the border
            >
              <div
                className='card-header'
                style={{
                  backgroundColor: 'rgba(255, 105, 180, 0.9)', // Bolder pink
                  color: '#fff', // White text for better contrast
                }}
              >
                <h4>Login</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={loginSubmit}>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      onChange={handleInput}
                      value={loginInput.email}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {loginInput.error_list.email}
                    </span>
                  </div>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Password
                    </label>
                    <input
                      type='password'
                      name='password'
                      onChange={handleInput}
                      value={loginInput.password}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {loginInput.error_list.password}
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
                        '&:hover': {
                          color: '#ff4081',
                          backgroundColor: '#fff',
                        },
                      }}
                    >
                      Login
                    </button>
                    <Link
                      to='/forgot-password'
                      className='btn btn-link'
                      style={{ color: '#ff69b4', marginLeft: '15px' }} // Pink link color
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className='form-group mb-3 text-end'>
                    <p>
                      Don't have an account?{' '}
                      <Link
                        to='/register'
                        className='btn btn-link'
                        style={{ color: '#ff69b4', fontWeight: 'bold' }} // Visible pink for the signup link
                      >
                        Signup here
                      </Link>
                    </p>
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
