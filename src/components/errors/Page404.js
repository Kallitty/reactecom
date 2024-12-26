import React from 'react'
import { Alert, Card } from 'react-bootstrap'

function Page404() {
  return (
    <main className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <Card>
            <Card.Body>
              <Alert variant='warning'>
                <Alert.Heading>
                  Oh snap! Page 404 | Page Not Found
                </Alert.Heading>
                <p>The URL or page you are searching for was not found.</p>
                <hr />
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Page404
