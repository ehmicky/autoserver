'use strict';

const { makeImmutable } = require('../../../utilities');

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = async function (nextFunc, input) {
  const { path, goal, log } = input;

  const route = findRoute({ routes, path, goal });

  const pathVars = getPathVars({ path, route });
  makeImmutable(pathVars);

  log.add({ route: route.name, pathVars });
  Object.assign(input, { route: route.name, pathVars });

  const response = await nextFunc(input);
  return response;
};

module.exports = {
  router,
};
