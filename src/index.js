import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom/client'
import App from './App.js'
// import './publicroute.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

// axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL
// // axios.defaults.baseURL = 'http://localhost:8000'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.post['Accept'] = 'application/json'
// axios.defaults.withCredentials = true
// axios.defaults.withXSRFToken = true
// axios.interceptors.request.use(function (config) {
//   const token = localStorage.getItem('auth_token')
//   config.headers.Authorization = token ? `Bearer ${token}` : ''
//   return config
// })

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
