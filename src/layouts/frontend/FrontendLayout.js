// import React from 'react'
// import Navbar from './Navbar'
// import Footer from './Footer'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import PublicRouteList from '../../routes/PublicRouteList'

// const FrontendLayout = () => {
//   return (
//     <div id='layoutSidenav_content'>
//       <Navbar />
//       <main>
//         <Routes>
//           {PublicRouteList.map((routedata, idx) => (
//             <Route
//               key={idx}
//               path={routedata.path}
//               element={routedata.element}
//             />
//           ))}
//           <Route path='/' element={<Navigate to='/home' />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default FrontendLayout

// import React from 'react'
// import Navbar from './Navbar'
// import Footer from './Footer'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import PublicRouteList from '../../routes/PublicRouteList'

// const FrontendLayout = ({ children }) => {
//   return (
//     <div id='layoutSidenav_content'>
//       <Navbar />
//       <main>
//         <Routes>
//           {/* Map over the public route list */}
//           {PublicRouteList.map((routedata, idx) => (
//             <Route
//               key={idx}
//               path={routedata.path}
//               element={routedata.element}
//             />
//           ))}
//           {/* Redirect to /home for the root path */}
//           <Route path='/' element={<Navigate to='/home' />} />
//         </Routes>
//         {children} {/* Render the children component */}
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default FrontendLayout

import React from 'react'
import Navbar from './Navbar'

import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRouteList from '../../routes/PublicRouteList'

const FrontendLayout = ({ children }) => {
  return (
    <div id='layoutSidenav_content'>
      <Navbar />
      <main>
        <Routes>
          {/* Map over the public route list
          {PublicRouteList.map((routedata, idx) => (
            <Route
              key={idx}
              path={routedata.path}
              element={routedata.element}
            />
          ))} */}
          {/* Redirect to /home for the root path */}
          <Route path='/market' element={<Navigate to='/' />} />
        </Routes>
        {children}
      </main>
    </div>
  )
}

export default FrontendLayout
