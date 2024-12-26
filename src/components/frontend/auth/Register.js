import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../../layouts/frontend/Navbar'
import swal from 'sweetalert'
import Footer from '../components/Footer/Footer'

export default function Register() {
  const navigate = useNavigate()
  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    error_list: {},
  })

  const handleInput = (e) => {
    setRegister({ ...registerInput, [e.target.name]: e.target.value })
  }

  const registerSubmit = (e) => {
    e.preventDefault()

    const data = {
      name: registerInput.name,
      email: registerInput.email,
      password: registerInput.password,
      password_confirmation: registerInput.password_confirmation,
    }
    axios.get('/sanctum/csrf-cookie').then((response) => {
      axios.post(`http://localhost:8000/api/register`, data).then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem('auth_token', res.data.token)
          localStorage.setItem('auth_username', res.data.username)
          swal('Success.', res.data.message, 'success')
          navigate('/login')
        } else {
          setRegister({
            ...registerInput,
            error_list: res.data.validation_errors,
          })
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
                <h4>Register</h4>
              </div>
              <div className='card-body'>
                <form onSubmit={registerSubmit}>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Full Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      onChange={handleInput}
                      value={registerInput.name}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {registerInput.error_list.name}
                    </span>
                  </div>
                  <div className='form-group mb-3'>
                    <label style={{ fontWeight: 'bold', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      onChange={handleInput}
                      value={registerInput.email}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {registerInput.error_list.email}
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
                      value={registerInput.password}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {registerInput.error_list.password}
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
                      value={registerInput.password_confirmation}
                      className='form-control'
                    />
                    <span className='text-danger'>
                      {registerInput.error_list.password_confirmation}
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
                      Register
                    </button>
                    <Link
                      to='/login'
                      className='btn btn-link'
                      style={{ color: '#ff69b4', marginLeft: '15px' }}
                    >
                      Already have an account?
                    </Link>
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
