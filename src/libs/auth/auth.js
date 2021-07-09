const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  const json = response.json()
  return json.then(Promise.reject.bind(Promise))
}

const buildUrl = path => {
  const cleanPath = path.replace(/^\//, '')
  const apiUrl = window.dunbar_env.API_URL.replace(/\/$/, '')
  return `${apiUrl}/${cleanPath}`
}

const buildHeaders = () => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const jwtToken = window.localStorage.getItem('jwtToken')
  if (jwtToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${jwtToken}`,
    }
  }
  return headers
}

export const callApi = (path, method = 'get', data = {}) => {
  const params = {
    method,
    headers: buildHeaders(),
  }
  if (method !== 'get') {
    params.body = JSON.stringify(data)
  }
  return window.fetch(buildUrl(path), params)
  .then(checkStatus)
  .then(response => {
    if (response.status !== 204) return response.json()
    return response
  })
}

export const isLogged = token => !!token

export const logout = history => {
  window.localStorage.clear()
  history.push('/login')
}
