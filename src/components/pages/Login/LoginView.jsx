import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { LoginForm } from './LoginComponents'

import './Login.less'

export const RawLoginView = props => {
  const { email, password, setEmail, setPassword, onLoginClick, hasError, errorMessage, loading, intl } = props
  const title = intl.formatMessage({ id: 'LOGIN_TITLE' })
  return (
    <div className="page uc-login">
      <div className="header">
        <h1>{title}</h1>
      </div>
      <div className="login">
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onLoginClick={onLoginClick}
          hasError={hasError}
          errorMessage={errorMessage}
          loading={loading}
        />
      </div>
    </div>
  )
}

RawLoginView.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
}

export const LoginView = injectIntl(RawLoginView)
