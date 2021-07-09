import React from 'react'
import { mount } from 'enzyme'
import { Logo } from '.'

describe('Logo', () => {
  let wrapper

  const props = {
  }

  beforeEach(() => {
    wrapper = mount(<Logo {...props} />)
  })

  describe('Render', () => {
    it('Should render 1 svg for desktop and 1 svg for tablet', () => {
      expect(wrapper.find('svg.desktop')).toHaveLength(1)
      expect(wrapper.find('svg.tablet')).toHaveLength(1)
    })
  })
})
