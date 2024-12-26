import About from '../components/frontend/About'
import Contact from '../components/frontend/Contact'
import Page404 from '../components/errors/Page404'
import Page403 from '../components/errors/Page403'
import Login from '../components/frontend/auth/Login'
import Register from '../components/frontend/auth/Register'
import ForgotPassword from '../components/frontend/auth/ForgotPassword'
import ViewCategory from '../components/frontend/collections/ViewCategory'
import ViewProduct from '../components/frontend/collections/ViewProduct'
import ProductDetail from '../components/frontend/collections/ProductDetail'
import Cart from '../components/frontend/Cart'
import Checkout from '../components/frontend/Checkout'
import MyOrders from '../components/frontend/MyOrders'
// import FrontendLayout from '../layouts/frontend/FrontendLayout'
import Market from '../components/frontend/Market'
// import MarketCategory from '../components/frontend/pages/MarketCategory'
import Product from '../components/frontend/pages/Product'
// import Wishlist from '../components/frontend/Wishlist'
// import ResetPassword from '../components/frontend/auth/ResetPassword'
// import Content from '../layouts/frontend/Content'
// import Help from '../components/frontend/Help'
// import Comment from '../components/frontend/Comment'
// import Search from '../components/frontend/Search'

const PublicRouteList = [
  // { path: '/', name: 'Market', element: <Market /> },
  // {
  //   path: '/humanhair',
  //   name: 'MarketCategory',
  //   element: <MarketCategory category='humanhair' />,
  // },
  // {
  //   path: '/hairblend',
  //   name: 'MarketCategory',
  //   element: <MarketCategory category='hairblend' />,
  // },
  // {
  //   path: '/syntheticfibre',
  //   name: 'MarketCategory',
  //   element: <MarketCategory category='syntheticfibre' />,
  // },
  // {
  //   path: '/product',
  //   name: 'Product',
  //   element: <Product />,
  // },
  {
    path: 'product/:productId',
    name: 'Product',
    element: <Product />,
  },
  // {
  //   path: '/:category_slug/:product_slug',
  //   name: 'ProductDetail',
  //   element: <ProductDetail />,
  // },
  { path: '/about', name: 'About', element: <About /> },
  { path: '/contact', name: 'Contact', element: <Contact /> },
  { path: '/403', name: 'Page403', element: <Page403 /> },
  { path: '/404', name: 'Page404', element: <Page404 /> },
  { path: '/login', name: 'Login', element: <Login /> },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    element: <ForgotPassword />,
  },
  { path: '/register', name: 'Register', element: <Register /> },
  { path: '/myorders', name: 'MyOrders', element: <MyOrders /> },
  { path: '/collections', name: 'ViewCategory', element: <ViewCategory /> },
  { path: '/collections/:slug', name: 'ViewProduct', element: <ViewProduct /> },
  {
    path: '/collections/:category_slug/:product_slug',
    name: 'ProductDetail',
    element: <ProductDetail />,
  },
  { path: '/cart', name: 'Cart', element: <Cart /> },
  { path: '/checkout', name: 'Checkout', element: <Checkout /> },
  // { path: '/help', name: 'Help', element: <Help /> },
  // { path: '/search/:key', name: 'Search', element: <Search /> },
  // { path: '/resetPassword', name: 'ResetPassword', element: <ResetPassword /> },
  // {
  //   path: '/collections/:category/:product/:id/comment',
  //   name: 'Comment',
  //   element: <Comment />,
  // },

  // { path: '/wishlist', name: 'Wishlist', element: <Wishlist /> },
]

export default PublicRouteList
