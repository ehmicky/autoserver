'use strict';

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = function ({ path, goal }) {
  const route = findRoute({ routes, path, goal });

  const pathVars = getPathVars({ path, route });

  return { route: route.name, pathVars };
};

module.exports = {
  router,
};
