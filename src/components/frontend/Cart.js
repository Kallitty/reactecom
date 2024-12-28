import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import swal from 'sweetalert'
import { FaTimes, FaRegHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const BASE_URL =
  'http://api.exchangeratesapi.io/v1/latest?access_key=6f398b79d13b5c3d9b17c0d6b9832ece'

function Cart() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const handleInput = (e) => {
    e.persist()
    setCart({ ...cart, [e.target.name]: e.target.value })
  }
  const [currencyOptions, setCurrencyOptions] = useState([])

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions([data.rates])
      })
  }, [])

  // const fullCurrency = (symbol) => {
  //   let t = ''
  //   currencySymbols.forEach((v) => {
  //     if (v['name'] == symbol) {
  //       t = v['symbol']
  //     }
  //   })
  //   return t
  // }

  // const adjustCurrency = (currency) => {
  //   for (const [key, value] of Object.entries(currencyOptions[0])) {
  //     if (key == darkTheme) {
  //       const s = fullCurrency(key)
  //       return `${s} ` + Math.floor(currency * value)
  //     }
  //   }
  // }
  var totalPrice = 0
  var discount = 0
  var Result = 0
  useEffect(() => {
    let isMountered = true

    axios.get(`/api/cart`).then((res) => {
      if (isMountered) {
        if (res.data.status === 200) {
          setCart(res.data.cart)
          setLoading(false)
        } else if (res.data.status === 401) {
          navigate('/')
          swal('Warning', res.data.message, 'error')
        }
      }
    })

    return () => {
      isMountered = false
    }
  }, [navigate])
  const handleDecrement = (cart_id) => {
    setCart((cart) =>
      cart.map((item) =>
        cart_id === item.id
          ? {
              ...item,
              product_qty: item.product_qty - (item.product_qty > 1 ? 1 : 0),
            }
          : item
      )
    )
    updateCartQuantity(cart_id, 'dec')
  }
  const handleIncrement = (cart_id) => {
    setCart((cart) =>
      cart.map((item) =>
        cart_id === item.id
          ? {
              ...item,
              product_qty: item.product_qty + (item.product_qty < 10 ? 1 : 0),
            }
          : item
      )
    )
    updateCartQuantity(cart_id, 'inc')
  }
  function updateCartQuantity(cart_id, scope) {
    axios.put(`/api/cart-updatequntity/${cart_id}/${scope}`).then((res) => {
      if (res.data.status === 200) {
        // swal("Success", res.data.message, "success");
        window.dispatchEvent(new Event('cartUpdated'))
      }
    })
  }
  const deleteCartItem = (e, cart_id) => {
    e.preventDefault()
    const thisClicked = e.currentTarget
    thisClicked.innerText = 'Removing'
    axios.delete(`/api/delete-cartitem/${cart_id}`).then((res) => {
      if (res.data.status === 200) {
        // swal("Succes", res.data.message, "success");
        thisClicked.closest('tr').remove()
        window.dispatchEvent(new Event('cartUpdated'))
      } else if (res.data.status === 404) {
        //  swal("Error", res.data.message, "error");
        thisClicked.innerText = 'Remove'
      }
    })
  }

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
        <ClipLoader size={50} color={'#e1356b'} loading={loading} />
      </div>
    )
  }

  var cart_HTML = ''
  if (cart.length > 0) {
    cart_HTML = (
      <div className='row'>
        <div className='col-md-9'>
          <div className='card'>
            <div className='table-responsive'>
              <table className='table table-borderless'>
                <thead className='text-muted'>
                  <tr className='small text-uppercase'>
                    <th scope='col'>Product</th>
                    <th scope='col' width='120'>
                      Quantity
                    </th>
                    <th scope='col' width='150'>
                      Price
                    </th>
                    <th scope='col' width='130' className='text-right'></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => {
                    totalPrice += item.product.selling_price * item.product_qty
                    Result = totalPrice

                    // Get the first image or a placeholder if no images are available

                    // const firstImage =
                    //   item.product.product_images &&
                    //   item.product.product_images.length > 0
                    //     ? `http://localhost:8000/${item.product.product_images[0].image_path}`
                    //     : 'http://localhost:8000/uploads/product_image/default-image.jpg'

                    const firstImage =
                      item.product.product_images &&
                      item.product.product_images.length > 0
                        ? `${process.env.REACT_APP_API_BASE_URL}/${item.product.product_images[0].image_path}`
                        : `${process.env.REACT_APP_API_BASE_URL}/uploads/product_image/default-image.jpg`

                    return (
                      <tr key={idx}>
                        <td>
                          <div className='row'>
                            <div className='col-3 d-none d-md-block'>
                              <img
                                src={firstImage}
                                alt={item.product.name}
                                width='50px'
                                height='50px'
                              />
                            </div>
                            <div className='col'>
                              <Link
                                className='text-decoration-none text-dark'
                                to='/'
                              >
                                {item.product.name}
                              </Link>
                              <p className='small text-muted'>
                                Size:{' '}
                                {item.product.size ? item.product.size : 'Null'}{' '}
                                | Color:{' '}
                                {item.product.color
                                  ? item.product.color
                                  : 'Null'}{' '}
                                | Brand:{' '}
                                {item.product.brand
                                  ? item.product.brand
                                  : 'Null'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='input-group input-group-sm mw-140'>
                            <button
                              onClick={() => handleDecrement(item.id)}
                              type='button'
                              className='input-group-text'
                            >
                              -
                            </button>
                            <div className='form-control text-center'>
                              {item.product_qty}
                            </div>
                            <button
                              onClick={() => handleIncrement(item.id)}
                              type='button'
                              className='input-group-text'
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          <var className='price'>
                            {item.product.selling_price * item.product_qty}
                          </var>
                          <small className='d-block text-muted'>
                            {item.product.selling_price} each
                          </small>
                        </td>
                        <td className='text-right'>
                          <button
                            className='btn btn-sm btn-outline-danger'
                            onClick={(e) => deleteCartItem(e, item.id)}
                            type='button'
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className='card-footer'>
              <Link
                className='btn  float-end'
                style={{
                  backgroundColor: '#ff4081',
                  textAlign: 'center',
                  color: '#fff',
                }}
                to='/checkout'
              >
                Make Purchase
                <FaArrowRight />
              </Link>

              <Link className='btn btn-secondary' to='/collections'>
                <FaArrowLeft />
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='card'>
            <div className='card-body'>
              <dl className='row border-bottom'>
                <dt className='col-6'>Total price:</dt>
                <dd className='col-6 text-right'>{totalPrice}</dd>
              </dl>
              <dl className='row'>
                <dt className='col-6'>Total:</dt>
                <dd className='col-6 text-right h5'>
                  <strong>{Result}</strong>
                </dd>
                <Link
                  to='/checkout'
                  className='btn '
                  style={{
                    backgroundColor: '#ff4081',
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  Confirm Cart
                </Link>
              </dl>
              <hr />
              <p className='text-center'>
                <img
                  src='https://e-commerce-template.surge.sh/images/payment/payments.webp'
                  alt='...'
                  height='26'
                />
              </p>
            </div>
          </div>
        </div>
        <div className='alert alert-success mt-3'>
          <p className='m-0'>
            <svg
              width='1em'
              height='1em'
              viewBox='0 0 16 16'
              className='mx-2'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'
              ></path>
            </svg>
            Free Delivery within 1-2 weeks
          </p>
        </div>
      </div>
    )
  } else {
    cart_HTML = (
      <div className='table-responsive'>
        <div className='card card-body py-5 text-center shadow-sm'>
          <h4>Your Shopping Cart is Empty</h4>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className='bg-secondary border-top  text-white mb-3'>
        <h6 style={{ backgroundColor: '#ff69b4', textAlign: 'center' }}>
          Shopping Cart
        </h6>
      </div>

      <div className='container mb-3'>{cart_HTML}</div>
      <div className='bg-light border-top p-4'>
        <div className='container'>
          <h5>Payment and Refund Policy</h5>

          <div>
            <h6>1. Payment Methods</h6>
            We accept a variety of payment methods to make your experience as
            smooth as possible. Below are the accepted payment methods:
            Credit/Debit Cards: Visa, MasterCard, American Express, Discover
            Digital Wallets: PayPal, Apple Pay, Google Pay Bank Transfers:
            Available for large orders upon request Cryptocurrency: We accept
            Bitcoin and Ethereum for select transactions.
            <h6>2. Payment Terms Immediate Payment:</h6> All payments are due at
            the time of order. Your order will not be processed until payment is
            confirmed. Currency: All transactions are processed in [Currency
            Name], unless otherwise specified. Taxes: Prices listed do not
            include applicable taxes. Any taxes (VAT, GST, etc.) will be
            calculated and displayed at checkout.
            <h6>3. Order Confirmation</h6> Upon successful payment, you will
            receive an email confirmation with: Your order details A payment
            receipt Estimated delivery time or availability for download (for
            digital goods)
            <h6> 4. Security </h6> We ensure secure payments through
            industry-standard SSL encryption. Your payment information is never
            stored on our servers and is processed by trusted third-party
            providers. <h6>5. Cancellations Before Shipping: </h6> Orders can be
            canceled before they are shipped without any penalty. To cancel,
            please contact our support team immediately. After Shipping: If your
            order has already been shipped, it cannot be canceled. You may,
            however, initiate a return or refund process as outlined below.
          </div>
          <div>
            <h5>Refund Policy</h5>
            <h6> 1. Eligibility for Refunds</h6> We offer refunds under the
            following circumstances: Defective or Damaged Products: If the
            product is faulty or damaged upon delivery, you are eligible for a
            full refund or replacement. Incorrect Orders: If you receive the
            wrong product, we will offer a replacement or full refund. Change of
            Mind (Physical Products): Returns due to a change of mind must be
            initiated within 14 days of delivery. The product must be unused, in
            original packaging, and in resaleable condition. Digital Products:
            Refunds are not available for digital products once they have been
            downloaded or accessed, unless they are faulty.
            <h6> 2. Non-Refundable Items </h6>
            Certain items are non-refundable, including: i. Digital products
            that have been downloaded. ii. Services that have already been
            rendered. iii.Perishable goods Gift cards
            <h6>3. Refund </h6>Process To request a refund, follow these steps:
            Contact Us: Submit a refund request via email or through our
            customer service portal within 14 days of receiving your product.
            Approval: Once your refund is approved, you will receive an email
            confirming the refund and the amount. Return the Product (If
            Applicable): If your refund requires you to return the product, it
            must be sent back to us in its original packaging, along with proof
            of purchase. Refund Timeline: Refunds will be processed within 7-10
            business days of receiving the returned product or approval of your
            refund request.
            <h6>4. Shipping and Handling Fees</h6> Shipping and handling fees
            are non-refundable, except in cases of damaged, defective, or
            incorrectly shipped items. You are responsible for covering the
            shipping costs for returning the product, unless otherwise
            specified.
            <h6>5. Exchange Policy </h6> We allow exchanges for defective or
            incorrect products. If you wish to exchange your product for a
            different size, color, or variation, please contact our support team
            within 14 days of delivery. <h6> Contact Us</h6> If you have any
            questions or concerns about our Payment or Refund Policy, please
            contact us at: <p> Email: support@[yourdomain].com </p>
            <p> Phone: +1-800-123-4567</p>{' '}
            <p> Business Hours: Mon-Fri, 9 AM - 6 PM (EST)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Cart
