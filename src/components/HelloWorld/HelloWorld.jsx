import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, gql } from '@apollo/client'
import { injectIntl } from 'react-intl'

import './HelloWorld.less'

export const EXCHANGE_RATES = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`

export const RawHelloWorld = ({ intl }) => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES)
  if (loading) return <p className="loading">Loading...</p>
  if (error) return <p className="error">Error !!!</p>

  const filtered = data.rates.filter(rate => rate.currency === 'EUR')[0]

  const title = intl.formatMessage({ id: 'HELLO_WORLD_TITLE' })
  const sentence = intl.formatMessage({ id: 'HELLO_WORLD_RATE_SENTENCE' }, {
    currency: filtered.currency,
    rate: filtered.rate,
  })

  return (
    <div className="hello-world">
      <h1>{title}</h1>
      <p>{sentence}</p>
    </div>
  )
}

RawHelloWorld.propTypes = {
  intl: PropTypes.object.isRequired,
}

export const HelloWorld = injectIntl(RawHelloWorld)
