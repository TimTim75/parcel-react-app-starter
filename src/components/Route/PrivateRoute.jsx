import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'

export const PrivateRoute = ({ component, isLogged, path, exact, history }) => {
  if (isLogged) {
    return <Route component={component} path={path} exact={exact} history={history} />
  }
  return <Redirect to={{ pathname: '/login' }} />
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}
