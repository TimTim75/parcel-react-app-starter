import React from 'react'
import PropTypes from 'prop-types'
import { Header } from '../../Header'

export const WelcomePage = ({ history }) => (
  <Header history={history} />
)

WelcomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}
