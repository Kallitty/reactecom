import React from 'react'
import Dashboard from '../components/admin/Dashboard'
import Profile from '../components/admin/Profile'
import Orders from '../components/admin/Order'
import Category from '../components/admin/category/Category'
import ViewCategory from '../components/admin/category/ViewCategory'
import EditCategory from '../components/admin/category/EditCategory'
import AddProduct from '../components/admin/product/AddProduct'
import ViewProduct from '../components/admin/product/ViewProduct'
import EditProduct from '../components/admin/product/EditProduct'

import NotFound from '../components/notfound/NotFound.jsx'
import '../assets/admin/css/styles.css'

const routes = [
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: 'orders',
    element: <Orders />,
  },
  {
    path: 'category',
    element: <Category />,
  },
  {
    path: 'view-category',
    element: <ViewCategory />,
  },
  {
    path: 'edit-category/:id',
    element: <EditCategory />,
  },
  {
    path: 'add-product',
    element: <AddProduct />,
  },
  {
    path: 'view-product',
    element: <ViewProduct />,
  },
  {
    path: 'edit-product/:id',
    element: <EditProduct />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
