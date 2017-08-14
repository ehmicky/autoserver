'use strict';

const { addReqInfo } = require('../../../events');

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = async function (nextFunc, input) {
  const { path, goal } = input;

  const route = findRoute({ routes, path, goal });

  const pathVars = getPathVars({ path, route });

  const inputA = addReqInfo(input, { route: route.name, pathVars });
  const inputB = { ...inputA, route: route.name, pathVars };

  const response = await nextFunc(inputB);
  return response;
};

module.exports = {
  router,
};
