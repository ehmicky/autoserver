'use strict';

const { addReqInfo } = require('../../../events');

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = function (input) {
  const { path, goal } = input;

  const route = findRoute({ routes, path, goal });

  const pathVars = getPathVars({ path, route });

  const inputA = addReqInfo(input, { route: route.name, pathVars });
  const inputB = { ...inputA, route: route.name, pathVars };

  return inputB;
};

module.exports = {
  router,
};
