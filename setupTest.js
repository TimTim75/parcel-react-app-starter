import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { translations } from './src/libs/translations'

global.mockIntl = {
  formatMessage: ({ id }, replacements) => {
    let translated = translations.en[id]
    if (replacements) {
      Object.keys(replacements).map(replacement => {
        translated = translated.replace(`{${replacement}}`, replacements[replacement])
        return null
      })
    }
    return translated
  },
}

configure({ adapter: new Adapter() })
