import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/client/react'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import { hotjar } from './libs/hotjar'
import { translations } from './libs/translations'
import { client } from './libs/apollo'
import App from './components/App'

const locale = 'en'

const sentryKey = window.dunbar_env.SENTRY_KEY
if (sentryKey) {
  Sentry.init({
    dsn: sentryKey,
    environment: window.dunbar_env.SENTRY_ENV,
  })
}

const hotjarId = window.dunbar_env.HOTJAR_ID
if (hotjarId) {
  hotjar(hotjarId)
}

render(
  <IntlProvider locale={locale} messages={translations[locale]}>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </IntlProvider>,
  document.getElementById('root'),
)
