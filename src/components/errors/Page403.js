import React from 'react'
import { Alert, Card } from 'react-bootstrap'

function Page403() {
  return (
    <main className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <Card>
            <Card.Body>
              <Alert variant='danger'>
                <Alert.Heading>
                  Oh snap! You got an error! Page 403 | Forbidden
                </Alert.Heading>
                <p>
                  Yes, you are reading this important warning message. This page
                  is an admin page. You are not an admin :(
                </p>
                <hr />
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Page403
