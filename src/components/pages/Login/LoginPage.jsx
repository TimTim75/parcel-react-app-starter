import React from 'react'
import PropTypes from 'prop-types'
import { LoginController } from './LoginController'

export const LoginPage = ({ history }) => (
  <LoginController history={history} />
)

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}
