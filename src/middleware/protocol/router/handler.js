'use strict';

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to mInput
const router = function ({ path, method }) {
  const route = findRoute({ routes, path, method });

  const pathVars = getPathVars({ path, route });

  return { route: route.name, pathVars };
};

module.exports = {
  router,
};
