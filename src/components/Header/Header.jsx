import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { IconButton } from '@material-ui/core'
import { PowerSettingsNew } from '@material-ui/icons'
import { logout } from '../../libs/auth'

import './Header.less'

export const RawHeader = ({ history }) => (
  <div className="uc-header">
    <div className="user">
      <IconButton onClick={() => logout(history)}>
        <PowerSettingsNew />
      </IconButton>
    </div>
  </div>
)

RawHeader.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export const Header = injectIntl(RawHeader)
