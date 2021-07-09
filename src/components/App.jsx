import React from 'react'
import PropTypes from 'prop-types'
import { Switch, withRouter } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './Route'
import { getRoutes } from '../libs/route'
import { isLogged } from '../libs/auth'

import '../styles/App.less'

const App = ({ history }) => {
  const token = window.localStorage.getItem('jwtToken')
  return (
    <Switch>
      {getRoutes().map(({ path, exact, component, restricted }) => {
        if (!restricted) {
          return (
            <PublicRoute
              path={path}
              exact={exact}
              key={path}
              component={component}
              isLogged={isLogged(token)}
              history={history}
            />
          )
        }
        return (
          <PrivateRoute
            path={path}
            exact={exact}
            key={path}
            component={component}
            isLogged={isLogged(token)}
            history={history}
          />
        )
      })}
    </Switch>
  )
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withRouter(App)
