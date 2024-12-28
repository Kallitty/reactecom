import React from 'react'
// import './publicroute.css'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import './App.css'
import { CartProvider } from './components/frontend/context/CartContext'
import Page403 from './components/errors/Page403'
import Page404 from './components/errors/Page404'
import Login from './components/frontend/auth/Login'
import Register from './components/frontend/auth/Register'
import ForgotPassword from './components/frontend/auth/ForgotPassword'
import PasswordReset from './components/frontend/auth/PasswordReset'
import Dashboard from './components/admin/Dashboard'
import axios from 'axios'
import AdminPrivateRoute from './AdminPrivateRoute'
import PublicRoute from './PublicRoute'

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

// axios.defaults.baseURL = 'http://localhost:8000/'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token')
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token')

  return (
    <div className='App'>
      <Router>
        <CartProvider>
          <Routes>
            {/* Admin routes */}
            <Route
              path='/admin/*'
              element={
                <AdminPrivateRoute>
                  <Routes>
                    <Route path='dashboard' element={<Dashboard />} />
                  </Routes>
                </AdminPrivateRoute>
              }
            />

            {/* Public routes */}
            <Route
              path='/*'
              element={<PublicRoute element={<PublicRoute />} />}
            />

            {/* Error and Auth routes */}
            <Route path='/403' element={<Page403 />} />
            <Route path='/404' element={<Page404 />} />
            <Route
              path='/login'
              element={isAuthenticated ? <Navigate to='/' /> : <Login />}
            />
            <Route
              path='/register'
              element={isAuthenticated ? <Navigate to='/' /> : <Register />}
            />
            <Route
              path='/forgot-password'
              element={
                isAuthenticated ? <Navigate to='/' /> : <ForgotPassword />
              }
            />
            <Route path='/password/reset/:token' element={<PasswordReset />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  )
}

export default App
