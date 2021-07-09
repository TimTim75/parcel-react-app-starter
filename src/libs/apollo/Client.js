import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'

const getApiUrl = () => {
  const apiUrl = window.dunbar_env.API_URL.replace(/\/$/, '')
  return `${apiUrl}/graphql`
}

const httpLink = createUploadLink({
  uri: getApiUrl(),
})

const authLink = setContext((_, { headers }) => {
  const jwtToken = window.localStorage.getItem('jwtToken')
  return {
    headers: {
      ...headers,
      authorization: jwtToken ? `Bearer ${jwtToken}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
