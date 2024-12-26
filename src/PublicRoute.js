import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/frontend/components/Footer/Footer'
import MarketContextProvider from './components/frontend/context/MarketContext'
import FrontendLayout from './layouts/frontend/FrontendLayout'
import PublicRouteList from './routes/PublicRouteList'
import MarketCategory from './components/frontend/pages/MarketCategory'
import Market from './components/frontend/Market'

function PublicRoute() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/all-category`) // Adjust API endpoint as needed
        setCategories(response.data.category)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <MarketContextProvider>
      <FrontendLayout>
        <Routes>
          {/* Render PublicRouteList routes */}
          <Route path='/' element={<Market />} />

          {PublicRouteList.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}

          {/* Render category-based routes dynamically */}
          {categories.map((category, i) => (
            <Route
              key={`category-${i}`}
              path={`/${category.slug}`}
              element={<MarketCategory category={category.slug} />}
            />
          ))}
        </Routes>
      </FrontendLayout>

      <Footer />
    </MarketContextProvider>
  )
}

export default PublicRoute

// import React from 'react'
// import Footer from './components/frontend/components/Footer/Footer'
// import MarketContextProvider from './components/frontend/context/MarketContext'

// // import './publicroute.css'
// import FrontendLayout from './layouts/frontend/FrontendLayout'

// function PublicRoute({ children }) {
//   return (
//     <>
//       <MarketContextProvider>
//         <FrontendLayout>{children}</FrontendLayout>
//       </MarketContextProvider>
//       <Footer />
//     </>
//   )
// }

// export default PublicRoute
