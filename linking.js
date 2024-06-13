const linking = {
  prefixes: ['https://instagram.com', 'instagram://'],
  config: {
    screens: {
      User: 'user/:userId',
      Auth: 'auth',
    },
  },
  getStateFromPath: (url, config) => {
    const path = url?.split('://')[1];
    if (!path) {
      return {routes: [{name: 'Auth'}]};
    }
    const [screen, ...params] = path.split('/');
    const routeName = config.screens[screen];
    if (!routeName) {
      return {routes: [{name: 'Auth'}]};
    }
    const paramsObj = params.reduce((acc, param, index) => {
      const paramName = routeName.split(':')[index + 1];
      if (paramName) {
        acc[paramName] = param;
      }
      return acc;
    }, {});

    return {routes: [{name: routeName, params: paramsObj}]};
  },

  getPathFromState: (state, config) => {
    const route = state.routes[state.routes.length - 1];
    const screenName = route.name;
    const screenPath = config.screens[screenName];
    const {params} = route;
    const paramValues = Object.values(params || {}).join('/');

    return `${screenPath}/${paramValues}`;
  },
};

export default linking;
