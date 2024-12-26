import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './dashboard.scss' // Custom SCSS for the dashboard

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
    hour12: true,
  }).format(date)
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    ordersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
    usersCount: 0,
    recentOrders: [],
    recentProducts: [],
    recentCategories: [],
    recentUsers: [],
  })

  useEffect(() => {
    // Fetch dashboard data
    axios.get('/dashboard').then((res) => {
      if (res.status === 200) {
        setDashboardData(res.data)
      }
    })
  }, [])

  const {
    ordersCount,
    productsCount,
    categoriesCount,
    usersCount,
    recentOrders,
    recentProducts,
    recentCategories,
    recentUsers,
  } = dashboardData

  return (
    <div className='admin-dashboard'>
      {/* Metrics Section */}
      <div className='row metrics-section'>
        <div className='col-md-3'>
          <div className='card metric-card'>
            <div className='card-body text-center'>
              <h5>Orders</h5>
              <h3>{ordersCount}</h3>
              <Link to='/admin/orders' className='btn btn-primary btn-sm mt-3'>
                View Orders
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card metric-card'>
            <div className='card-body text-center'>
              <h5>Products</h5>
              <h3>{productsCount}</h3>
              <Link
                to='/admin/view-product'
                className='btn btn-success btn-sm mt-3'
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card metric-card'>
            <div className='card-body text-center'>
              <h5>Categories</h5>
              <h3>{categoriesCount}</h3>
              <Link
                to='/admin/view-category'
                className='btn btn-warning btn-sm mt-3'
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card metric-card'>
            <div className='card-body text-center'>
              <h5>Users</h5>
              <h3>{usersCount}</h3>
              <Link to='/admin/profile' className='btn btn-info btn-sm mt-3'>
                View Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data Section */}
      <div className='row recent-data-section'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>
              <h5>Recent Orders</h5>
            </div>
            <div className='card-body table-responsive'>
              <table className='table table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tracking No</th>
                    <th>Payment ID</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.tracking_no}</td>
                      <td>{order.payment_id}</td>
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>
              <h5>Recent Products</h5>
            </div>
            <div className='card-body table-responsive'>
              <table className='table table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>NGN{product.selling_price}</td>
                      <td>{formatDate(product.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>
              <h5>Recent Categories</h5>
            </div>
            <div className='card-body table-responsive'>
              <table className='table table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>{formatDate(category.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>
              <h5>Recent Users</h5>
            </div>
            <div className='card-body table-responsive'>
              <table className='table table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
