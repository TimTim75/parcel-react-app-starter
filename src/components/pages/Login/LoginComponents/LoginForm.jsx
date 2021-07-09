import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { FormControl, TextField } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'

import './LoginForm.less'

export const RawLoginForm = props => {
  const { email, password, setEmail, setPassword, onLoginClick, hasError, errorMessage, loading, intl } = props
  const title = intl.formatMessage({ id: 'LOGIN_FORM_TITLE' })
  const emailLabelText = intl.formatMessage({ id: 'LOGIN_FORM_EMAIL_LABEL' })
  const passwordLabelText = intl.formatMessage({ id: 'LOGIN_FORM_PASSWORD_LABEL' })
  const buttonText = intl.formatMessage({ id: 'LOGIN_FORM_BUTTON' })
  const errorText = errorMessage ? intl.formatMessage({ id: errorMessage }) : ''
  return (
    <div className="login-form">
      <div className="login-form-header">
        <h2>{title}</h2>
      </div>
      <div className="login-form-body">
        <FormControl fullWidth>
          <TextField
            required
            id="email"
            type="email"
            label={emailLabelText}
            placeholder="me@urbancampus.com"
            variant="outlined"
            className="email-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={hasError}
            autoFocus
          />
          <TextField
            required
            id="password"
            type="password"
            label={passwordLabelText}
            variant="outlined"
            className="password-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={hasError}
            helperText={errorText}
          />
        </FormControl>
      </div>
      <div className="login-form-footer">
        <LoadingButton
          variant="contained"
          className="login-button"
          onClick={onLoginClick}
          disabled={!email || !password}
          loading={loading}
        >
          {buttonText}
        </LoadingButton>
      </div>
    </div>
  )
}

RawLoginForm.propTypes = {
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

export const LoginForm = injectIntl(RawLoginForm)
