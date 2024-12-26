/* global paypal */

import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import swal from 'sweetalert'
import { BsTruck, BsCartPlus } from 'react-icons/bs'
import PaystackPop from '@paystack/inline-js'
// import usePaystackPayment from 'paystack-web-sdk'
import { MdPayments } from 'react-icons/md'

const BASE_URL =
  'http://api.exchangeratesapi.io/v1/latest?access_key=6f398b79d13b5c3d9b17c0d6b9832ece'

function Checkout() {
  const navigate = useNavigate()

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        // setCurrencyOptions([data.rates])
      })
  }, [])

  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  const [checkoutInput, setCheckoutInput] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  })
  const [error, setError] = useState([])
  const cartCount = cart.length
  useEffect(() => {
    let isMountered = true

    axios.get(`/cart`).then((res) => {
      if (isMountered) {
        if (res.data.status === 200) {
          setCart(res.data.cart)
          setLoading(false)
        } else if (res.data.status === 401) {
          navigate.push('/')
          swal('Warning', res.data.message, 'error')
        }
      }
    })

    return () => {
      isMountered = false
    }
  }, [navigate])

  const handleInput = (e) => {
    e.persist()
    setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value })
  }
  const orderinfo_data = {
    firstname: checkoutInput.firstname,
    lastname: checkoutInput.lastname,
    phone: checkoutInput.phone,
    email: checkoutInput.email,
    address: checkoutInput.address,
    city: checkoutInput.city,
    state: checkoutInput.state,
    zipcode: checkoutInput.zipcode,
    payment_mode: 'Paid by Paypal',
    payment_id: '',
  }

  const PayPalButton = paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice,
          },
        },
      ],
    })
  }

  const paywithpaystack = (e) => {
    e.preventDefault()
    const paystack = new PaystackPop()

    paystack.newTransaction({
      key: 'pk_test_0373757368461e07334981bc3b6fa08459f7545a',
      amount: totalPrice * 100, // Paystack expects the amount in kobo (for NGN), so multiply by 100
      email: checkoutInput.email,
      currency: 'NGN',
      onSuccess: (transaction) => {
        const reference = transaction.reference

        // On successful payment, submit the order to your backend
        const paymentData = {
          firstname: checkoutInput.firstname,
          lastname: checkoutInput.lastname,
          phone: checkoutInput.phone,
          email: checkoutInput.email,
          address: checkoutInput.address,
          city: checkoutInput.city,
          state: checkoutInput.state,
          zipcode: checkoutInput.zipcode,
          payment_mode: 'Paystack',
          payment_id: reference,
        }

        axios.post('/place-order', paymentData).then((res) => {
          if (res.data.status === 200) {
            swal('Order Placed Successfully', '', 'success')
            setError([])
            navigate('/thank-you')
          } else if (res.data.status === 422) {
            swal('All fields are mandatory', '', 'error')
            setError(res.data.errors)
          }
        })
      },
      onCancel: () => {
        swal('Payment was cancelled.', '', 'error')
      },
      onError: (error) => {
        swal('Payment Error', error.message, 'error')
      },
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      // return actions.order.capture()
      return actions.order.capture().then(function (details) {
        orderinfo_data.payment_id = details.id
        axios.post(`/place-order`, orderinfo_data).then((res) => {
          if (res.data.status === 200) {
            swal('Order Placed Successfully', '', 'success')
            setError([])
            navigate('/thank-you')
          } else if (res.data.status === 422) {
            swal('All fields are mandatory', '', 'error')
            setError(res.data.errors)
          }
        })
      })
      // console.log('Transaction completed by ' + details.payer.name.given_name)
    })
  }

  const submitOrder = (e, payment_mode) => {
    e.preventDefault()
    const data = {
      firstname: checkoutInput.firstname,
      lastname: checkoutInput.lastname,
      phone: checkoutInput.phone,
      email: checkoutInput.email,
      address: checkoutInput.address,
      city: checkoutInput.city,
      state: checkoutInput.state,
      zipcode: checkoutInput.zipcode,
      payment_mode: payment_mode,
      payment_id: '',
    }

    switch (payment_mode) {
      case 'cod':
        axios.post(`/place-order`, data).then((res) => {
          if (res.data.status === 200) {
            swal('Order Placed Successfully', '', 'success')
            setError([])
            navigate('/thank-you')
          } else if (res.data.status === 422) {
            swal('All fields are mandatory', '', 'error')
            setError(res.data.errors)
          }
        })
        break
      case 'payonline':
        axios.post(`/validate-order`, data).then((res) => {
          if (res.data.status === 200) {
            // swal('Order Placed Successfully', '', 'success')
            setError([])
            var myModal = new window.bootstrap.Modal(
              document.getElementById('payOnlineModal')
            )
            myModal.show()
            // payOnline
            // navigate('/thank-you')
          } else if (res.data.status === 422) {
            swal('All fields are mandatory', '', 'error')
            setError(res.data.errors)
          }
        })
        break

      case 'paystack':
        axios.post(`/validate-order`, data).then((res) => {
          if (res.data.status === 200) {
            // swal('Order Placed Successfully', '', 'success')
            setError([])
            var myModal = new window.bootstrap.Modal(
              document.getElementById('payStackModal')
            )
            myModal.show()

            // navigate('/thank-you')
          } else if (res.data.status === 422) {
            swal('All fields are mandatory', '', 'error')
            setError(res.data.errors)
          }
        })
        break

      default:
        break
    }
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

  var totalPrice = 0
  var discount = 0
  var result = 0

  var checkout_HTML = ''
  if (cart.length > 0) {
    checkout_HTML = (
      <div className='row'>
        <div className='col-md-8'>
          <div className='card mb-3'>
            <div className='card-header'>
              <svg
                width='1em'
                height='1em'
                viewBox='0 0 16 16'
                className='mx-2'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z'
                ></path>
              </svg>
              Contact Info
            </div>
            <div className='card-body'>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.email}
                    type='text'
                    name='email'
                    className='form-control'
                    placeholder='Email Address'
                  />
                  <small className='text-danger'>{error.email}</small>
                </div>
                <div className='col-md-6'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.phone}
                    type='text'
                    name='phone'
                    className='form-control'
                    placeholder='Mobile No'
                  />
                  <small className='text-danger'>{error.phone}</small>
                </div>
              </div>
            </div>
          </div>
          <div className='card mb-3'>
            <div className='card-header'>
              <BsTruck className='mx-2' />
              Shipping Information
            </div>
            <div className='card-body'>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.firstname}
                    type='text'
                    name='firstname'
                    className='form-control'
                    placeholder='Name'
                  />
                  <small className='text-danger'>{error.firstname}</small>
                </div>
                <div className='col-md-6'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.lastname}
                    type='text'
                    name='lastname'
                    className='form-control'
                    placeholder='Last Name'
                  />
                  <small className='text-danger'>{error.lastname}</small>
                </div>
                <div className='col-md-12'>
                  <textarea
                    onChange={handleInput}
                    value={checkoutInput.address}
                    rows='3'
                    name='address'
                    className='form-control'
                    placeholder='Address'
                  />
                  <small className='text-danger'>{error.address}</small>
                </div>
                <div className='col-md-4'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.city}
                    type='text'
                    name='city'
                    className='form-control'
                    placeholder='City'
                  />
                  <small className='text-danger'>{error.city}</small>
                </div>
                <div className='col-md-4'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.state}
                    type='text'
                    name='state'
                    className='form-control'
                    placeholder='State'
                  />
                  <small className='text-danger'>{error.state}</small>
                </div>
                <div className='col-md-4'>
                  <input
                    onChange={handleInput}
                    value={checkoutInput.zipcode}
                    type='text'
                    name='zipcode'
                    className='form-control'
                    placeholder='Zip Code'
                  />
                  <small className='text-danger'>{error.zipcode}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card'>
            <div className='card-header'>
              <BsCartPlus className='mx-2' />
              Cart
              <span className='badge bg-secondary float-end'>{cartCount}</span>
            </div>
            <div className='list-group list-group-flush'>
              <li className='list-group-item d-flex justify-content-between lh-sm'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th width='40%'>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => {
                      totalPrice +=
                        item.product.selling_price * item.product_qty

                      // console.log(totalPrice)
                      result = totalPrice
                      return (
                        <tr key={idx}>
                          <td>{item.product.name}</td>
                          <td>{item.product.selling_price}</td>
                          <td>{item.product_qty}</td>
                          <td>
                            {item.product.selling_price * item.product_qty}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </li>

              <div className='card'>
                <div className='card-body'>
                  <dl className='row border-bottom'>
                    <dt className='col-6'>Total price:</dt>
                    <dd className='col-6 text-right'>{totalPrice}</dd>
                  </dl>

                  <dl className='row'>
                    <br />
                    <hr />
                    <button
                      type='button'
                      className='btn '
                      style={{
                        backgroundColor: '#ff4081',
                        textAlign: 'center',
                        color: '#fff',
                      }}
                      onClick={(e) => submitOrder(e, 'cod')}
                    >
                      Place Order
                    </button>
                  </dl>
                  <dl className='row'>
                    <br />
                    <button
                      type='button'
                      className='btn btn-warning'
                      onClick={(e) => submitOrder(e, 'payonline')}
                    >
                      Pay Online
                    </button>
                  </dl>

                  <dl className='row'>
                    <br />
                    <button
                      type='button'
                      className='btn'
                      style={{ backgroundColor: '#00C5B5', color: '#fff' }}
                      onClick={(e) => submitOrder(e, 'paystack')}
                    >
                      Pay with Paystack
                    </button>
                  </dl>

                  <div
                    className='modal fade'
                    id='payStackModal'
                    tabIndex='-1'
                    aria-labelledby='payStackModalLabel'
                    aria-hidden='true'
                  >
                    <div className='modal-dialog'>
                      <div className='modal-content'>
                        <div className='modal-header'>
                          <h5 className='modal-title' id='payStackModalLabel'>
                            Paystack Payment
                          </h5>
                          <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                          ></button>
                        </div>
                        <div className='modal-body text-center'>
                          {/* Centered email and amount */}
                          <div className='row justify-content-center'>
                            <div className='col-md-6 text-center'>
                              <p>
                                <strong>Your Email: </strong>{' '}
                                {checkoutInput.email}
                              </p>
                            </div>
                            <div className='col-md-6 text-center'>
                              <p>
                                <strong>Total Price: </strong> {totalPrice}
                              </p>
                            </div>
                          </div>

                          {/* Long Paystack button */}
                          <div className='mt-3'>
                            <button
                              type='button'
                              className='btn btn-paystack w-100' // Full-width button
                              onClick={paywithpaystack}
                              style={{
                                backgroundColor: '#00C5B5',
                                color: '#fff',
                                padding: '10px',
                              }}
                            >
                              Proceed with Paystack
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    checkout_HTML = (
      <div className='table-responsive'>
        <div className='card card-body py-5 text-center shadow-sm'>
          <h4>Your Shopping Cart is Empty. You are in Checkout Page </h4>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Modal for Paypal*/}
      <div
        className='modal fade'
        id='payOnlineModal'
        tabIndex='-1'
        aria-labelledby='payOnlineModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='payOnlineModalLabel'>
                Online Payment Mode
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <hr />
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modal for payStackModal */}

      <div className='bg-secondary border-top  text-white mb-3'>
        <h5 style={{ backgroundColor: '#ff69b4', textAlign: 'center' }}>
          Checkout
        </h5>
      </div>
      <div className='container mb-3'>{checkout_HTML}</div>
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

export default Checkout
