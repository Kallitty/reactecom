// import React from 'react'
// import Navbar from './Navbar'
// import Sidebar from './Sidebar'
// import Footer from './Footer'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import routes from '../../routes/routes'
// import '../../styles.css'

// const MasterLayout = () => {
//   return (
//     <div id='layoutSidenav'>
//       <div
//         id='layoutSidenav_nav'
//         className='sb-sidenav sb-sidenav-dark collapse'
//       >
//         <Sidebar />
//       </div>

//       <div id='layoutSidenav_content'>
//         <Navbar />
//         <main>
//           <Routes>
//             {routes.map((route, idx) => (
//               <Route key={idx} path={route.path} element={route.element} />
//             ))}
//             <Route path='/' element={<Navigate to='/admin/dashboard' />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   )
// }

// export default MasterLayout

import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from '../../routes/routes'

const MasterLayout = () => {
  return (
    <div id='layoutSidenav'>
      <div
        id='layoutSidenav_nav'
        className='collapse sb-sidenav sb-sidenav-dark'
        style={{ zIndex: 10 }}
      >
        <Sidebar />
      </div>

      <div id='layoutSidenav_content'>
        <Navbar />
        <main>
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}
            <Route path='/' element={<Navigate to='/admin/dashboard' />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MasterLayout
