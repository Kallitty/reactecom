import React from 'react'
import Hero from '../frontend/components/Hero/Hero'
import Popular from '../frontend/components/Popular/Popular'
import Offers from '../frontend/components/Offers/Offers'
import NewCollections from '../frontend/components/NewCollections/NewCollections'
import NewsLetter from '../frontend/components/Newsletter/NewsLetter'

const Market = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  )
}

export default Market
