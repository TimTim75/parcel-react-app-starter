import React from 'react'
import { mount } from 'enzyme'
import { RawLoginForm } from './LoginForm'

describe('LoginForm', () => {
  const setEmailMock = jest.fn()
  const setPasswordMock = jest.fn()
  const onLoginClickMock = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Render', () => {
    it('Should render default view', () => {
      const props = {
        email: '',
        password: '',
        setEmail: setEmailMock,
        setPassword: setPasswordMock,
        onLoginClick: onLoginClickMock,
        hasError: false,
        errorMessage: '',
        loading: false,
        intl: mockIntl,
      }
      const wrapper = mount(<RawLoginForm {...props} />)
      expect(wrapper.find('.login-form')).toHaveLength(1)
      expect(wrapper.find('.login-form h2')).toHaveLength(1)
      expect(wrapper.find('.login-form h2').text()).toBe('Please login')
      expect(wrapper.find('.login-form input')).toHaveLength(2)
      expect(wrapper.find('.login-form button')).toHaveLength(1)
    })
    it('Should render error view', () => {
      const props = {
        email: '',
        password: '',
        setEmail: setEmailMock,
        setPassword: setPasswordMock,
        onLoginClick: onLoginClickMock,
        hasError: true,
        errorMessage: 'DEFAULT_ERROR',
        loading: false,
        intl: mockIntl,
      }
      const wrapper = mount(<RawLoginForm {...props} />)
      expect(wrapper.find('.login-form')).toHaveLength(1)
      expect(wrapper.find('.login-form MuiFormHelperTextRoot p')).toHaveLength(1)
      expect(wrapper.find('.login-form MuiFormHelperTextRoot p').text()).toBe('An error occured')
    })
  })

  describe('Callbacks', () => {
    it('Should call setEmailMock', () => {
      const props = {
        email: '',
        password: '',
        setEmail: setEmailMock,
        setPassword: setPasswordMock,
        onLoginClick: onLoginClickMock,
        hasError: false,
        errorMessage: '',
        loading: false,
        intl: mockIntl,
      }
      const wrapper = mount(<RawLoginForm {...props} />)
      expect(wrapper.find('.login-form input')).toHaveLength(2)
      wrapper.find('.login-form input').at(0).simulate('change', { target: { value: 'hello' } })
      expect(setEmailMock).toHaveBeenCalledTimes(1)
    })
    it('Should call setPasswordMock', () => {
      const props = {
        email: '',
        password: '',
        setEmail: setEmailMock,
        setPassword: setPasswordMock,
        onLoginClick: onLoginClickMock,
        hasError: false,
        errorMessage: '',
        loading: false,
        intl: mockIntl,
      }
      const wrapper = mount(<RawLoginForm {...props} />)
      expect(wrapper.find('.login-form input')).toHaveLength(2)
      wrapper.find('.login-form input').at(1).simulate('change', { target: { value: 'hello' } })
      expect(setPasswordMock).toHaveBeenCalledTimes(1)
    })
    it('Should call onLoginClickMock', () => {
      const props = {
        email: 'test',
        password: 'test',
        setEmail: setEmailMock,
        setPassword: setPasswordMock,
        onLoginClick: onLoginClickMock,
        hasError: false,
        errorMessage: '',
        loading: false,
        intl: mockIntl,
      }
      const wrapper = mount(<RawLoginForm {...props} />)
      expect(wrapper.find('.login-form input')).toHaveLength(2)
      wrapper.find('.login-form button').simulate('click')
      expect(onLoginClickMock).toHaveBeenCalledTimes(1)
    })
  })
})
