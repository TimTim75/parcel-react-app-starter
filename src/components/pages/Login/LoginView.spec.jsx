import React from 'react'
import { shallow } from 'enzyme'
import { RawLoginView } from './LoginView'

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
      const wrapper = shallow(<RawLoginView {...props} />)
      expect(wrapper.find('.page.uc-login')).toHaveLength(1)
      expect(wrapper.find('.page.uc-login h1')).toHaveLength(1)
      expect(wrapper.find('.page.uc-login h1').text()).toBe('Welcome on Urbancampus Admin app')
    })
  })
})
