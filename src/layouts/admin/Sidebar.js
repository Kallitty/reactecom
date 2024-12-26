import React from 'react'
import { Link } from 'react-router-dom'


const Sidebar = () => {
  return (
    <nav className='sb-sidenav accordion sb-sidenav-dark' id='sidenavAccordion' style={{ height: '200vh',  }}>
      <div className='sb-sidenav-menu'>
        <div className='nav'>
          <div className='sb-sidenav-menu-heading'>Core</div>

          <Link className='nav-link' to='/admin/dashboard'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-tachometer-alt'></i>
            </div>
            Dashboard
          </Link>

          <Link className='nav-link' to='/admin/profile'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-user'></i>
            </div>
            Profiles
          </Link>
          <Link className='nav-link' to='/admin/orders'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-user'></i>
            </div>
            Orders
          </Link>

          <Link className='nav-link' to='/admin/category'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-tags'></i>
            </div>
            Category
          </Link>

          <Link className='nav-link' to='/admin/view-category'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-eye'></i>
            </div>
            View Category
          </Link>

          {/* Products Section */}
          <Link
            className='nav-link collapsed'
            to='#'
            data-bs-toggle='collapse'
            data-bs-target='#collapseProducts'
            aria-expanded='false'
            aria-controls='collapseProducts'
          >
            <div className='sb-nav-link-icon'>
              <i className='fas fa-box-open'></i>
            </div>
            Products
            <div className='sb-sidenav-collapse-arrow'>
              <i className='fas fa-chevron-down'></i>
            </div>
          </Link>
          <div
            className='collapse'
            id='collapseProducts'
            aria-labelledby='headingOne'
            data-bs-parent='#sidenavAccordion'
          >
            <nav className='sb-sidenav-menu-nested nav'>
              <Link className='nav-link' to='/admin/add-product'>
                Add Products
              </Link>
              <Link className='nav-link' to='/admin/view-product'>
                View Products
              </Link>
            </nav>
          </div>

          <div className='sb-sidenav-menu-heading'>Interface</div>

          <Link
            className='nav-link collapsed'
            to='#'
            data-bs-toggle='collapse'
            data-bs-target='#collapseLayouts'
            aria-expanded='false'
            aria-controls='collapseLayouts'
          >
            <div className='sb-nav-link-icon'>
              <i className='fas fa-columns'></i>
            </div>
            Layouts
            <div className='sb-sidenav-collapse-arrow'>
              <i className='fas fa-chevron-down'></i>
            </div>
          </Link>
          <div
            className='collapse'
            id='collapseLayouts'
            aria-labelledby='headingOne'
            data-bs-parent='#sidenavAccordion'
          >
            <nav className='sb-sidenav-menu-nested nav'>
              <Link className='nav-link' to='/admin/static-navigation'>
                Static Navigation
              </Link>
              <Link className='nav-link' to='/admin/light-sidenav'>
                Light Sidenav
              </Link>
            </nav>
          </div>

          {/* Pages Section */}
          <Link
            className='nav-link collapsed'
            to='#'
            data-bs-toggle='collapse'
            data-bs-target='#collapsePages'
            aria-expanded='false'
            aria-controls='collapsePages'
          >
            <div className='sb-nav-link-icon'>
              <i className='fas fa-book-open'></i>
            </div>
            Pages
            <div className='sb-sidenav-collapse-arrow'>
              <i className='fas fa-chevron-down'></i>
            </div>
          </Link>
          <div
            className='collapse'
            id='collapsePages'
            aria-labelledby='headingTwo'
            data-bs-parent='#sidenavAccordion'
          >
            <nav
              className='sb-sidenav-menu-nested nav accordion'
              id='sidenavAccordionPages'
            >
              <Link
                className='nav-link collapsed'
                to='#'
                data-bs-toggle='collapse'
                data-bs-target='#pagesCollapseAuth'
                aria-expanded='false'
                aria-controls='pagesCollapseAuth'
              >
                Authentication
                <div className='sb-sidenav-collapse-arrow'>
                  <i className='fas fa-chevron-down'></i>
                </div>
              </Link>
              <div
                className='collapse'
                id='pagesCollapseAuth'
                aria-labelledby='headingOne'
                data-bs-parent='#sidenavAccordionPages'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <Link className='nav-link' to='/login'>
                    Login
                  </Link>
                  <Link className='nav-link' to='/register'>
                    Register
                  </Link>
                  <Link className='nav-link' to='/forgot-password'>
                    Forgot Password
                  </Link>
                </nav>
              </div>

              <Link
                className='nav-link collapsed'
                to='#'
                data-bs-toggle='collapse'
                data-bs-target='#pagesCollapseError'
                aria-expanded='false'
                aria-controls='pagesCollapseError'
              >
                Error
                <div className='sb-sidenav-collapse-arrow'>
                  <i className='fas fa-chevron-down'></i>
                </div>
              </Link>
              <div
                className='collapse'
                id='pagesCollapseError'
                aria-labelledby='headingOne'
                data-bs-parent='#sidenavAccordionPages'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <Link className='nav-link' to='/401'>
                    401 Page
                  </Link>
                  <Link className='nav-link' to='/404'>
                    404 Page
                  </Link>
                  <Link className='nav-link' to='/500'>
                    500 Page
                  </Link>
                </nav>
              </div>
            </nav>
          </div>

          <div className='sb-sidenav-menu-heading'>Addons</div>

          <Link className='nav-link' to='/charts'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-chart-area'></i>
            </div>
            Charts
          </Link>

          <Link className='nav-link' to='/tables'>
            <div className='sb-nav-link-icon'>
              <i className='fas fa-table'></i>
            </div>
            Tables
          </Link>
        </div>
      </div>
      <div className='sb-sidenav-footer'>
        <div className='small'>Logged in as:</div>
        Administrator
      </div>
    </nav>
  )
}

export default Sidebar
