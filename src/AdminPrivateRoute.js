import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import MasterLayout from './layouts/admin/MasterLayout'

import { ClipLoader } from 'react-spinners'

function AdminPrivateRoute({ children }) {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const res = await axios.get('/api/checkingAuthenticated')
        if (res.data.status === 200) {
          setIsAuthenticated(true)
          const userRes = await axios.get('/api/user')
          if (userRes.data.role_as === 1) {
            // Assuming '1' indicates an admin role
            setIsAdmin(true)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndRole()

    return () => {
      setIsAuthenticated(false)
      setIsAdmin(false)
    }
  }, [])

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

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/login' state={{ from: location }} />
  }

  return <MasterLayout>{children}</MasterLayout>
}

export default AdminPrivateRoute
