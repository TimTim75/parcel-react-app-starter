import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import { LoginView } from './LoginView'
import { callApi } from '../../../libs/auth'
import GetUser from './LoginQueries/getUser.gql'

export const LoginController = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [getUser] = useLazyQuery(GetUser, {
    fetchPolicy: 'network-only',
    onError: () => {
      setHasError(true)
      setErrorMessage('DEFAULT_ERROR')
      setLoading(false)
    },
    onCompleted: data => {
      if (data.me.roles !== 2) {
        setHasError(true)
        setErrorMessage('LOGIN_FORM_ERROR_NOT_ADMIN')
        window.localStorage.clear()
      } else {
        history.push('/')
      }
      setLoading(false)
    },
  })

  const onLoginClick = () => {
    setLoading(true)
    callApi('/auth', 'POST', {
      email: email.trim(),
      password,
    })
    .then(response => {
      const { token } = response
      window.localStorage.setItem('jwtToken', token)
      return getUser()
    })
    .catch(() => {
      setHasError(true)
      setErrorMessage('LOGIN_FORM_ERROR_EMAIL_PASSWORD')
      setLoading(false)
    })
  }

  return (
    <LoginView
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onLoginClick={onLoginClick}
      hasError={hasError}
      errorMessage={errorMessage}
      loading={loading}
    />
  )
}

LoginController.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}
