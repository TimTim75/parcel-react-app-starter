import * as Pages from '../../components/pages'

const routes = {
  login: {
    path: '/login',
    exact: true,
    component: Pages.LoginPage,
    restricted: false,
  },
  welcome: {
    path: '/',
    exact: true,
    component: Pages.WelcomePage,
    restricted: true,
  },
}

export const getRoutes = () => {
  const sortedRoutes = Object.keys(routes).map(key => ({
    currentStep: key,
    path: routes[key].path,
    exact: routes[key].exact,
    component: routes[key].component,
    restricted: routes[key].restricted,
  }))
  return sortedRoutes
}
