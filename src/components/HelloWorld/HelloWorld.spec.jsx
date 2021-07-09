import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { MockedProvider } from '@apollo/client/testing'
import { EXCHANGE_RATES, RawHelloWorld } from './HelloWorld'

const errorMock = {
  request: {
    query: EXCHANGE_RATES,
  },
  error: new Error('An error occurred'),
}
const successMock = {
  request: {
    query: EXCHANGE_RATES,
  },
  result: {
    data: {
      rates: [{
        currency: 'EUR',
        rate: '0.827502',
      }],
    },
  },
}

describe('HelloWorld', () => {
  describe('Render', () => {
    it('Should render error', async () => {
      let wrapper
      await act(async () => {
        wrapper = mount(
          <MockedProvider mocks={[errorMock]} addTypename={false}>
            <RawHelloWorld intl={mockIntl} />
          </MockedProvider>,
        )
        expect(wrapper.find('.loading')).toHaveLength(1)
        await new Promise(resolve => setTimeout(resolve, 100))
        wrapper.update()
        expect(wrapper.find('.error')).toHaveLength(1)
      })
    })
    it('Should render success', async () => {
      let wrapper
      await act(async () => {
        wrapper = mount(
          <MockedProvider mocks={[successMock]} addTypename={false}>
            <RawHelloWorld intl={mockIntl} />
          </MockedProvider>,
        )
        expect(wrapper.find('.loading')).toHaveLength(1)
        await new Promise(resolve => setTimeout(resolve, 100))
        wrapper.update()
        expect(wrapper.find('.hello-world')).toHaveLength(1)
        expect(wrapper.find('.hello-world h1')).toHaveLength(1)
        expect(wrapper.find('.hello-world h1').text()).toBe('Hello world')
        expect(wrapper.find('.hello-world p')).toHaveLength(1)
        expect(wrapper.find('.hello-world p').text()).toBe('Current rate for EUR is 0.827502 in USD')
      })
    })
  })
})
