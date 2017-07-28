'use strict';

const { makeImmutable } = require('../../../utilities');
const { addLogInfo } = require('../../../logging');

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = async function (nextFunc, input) {
  const { path, goal } = input;

  const route = findRoute({ routes, path, goal });

  const pathVars = getPathVars({ path, route });
  makeImmutable(pathVars);

  const inputA = addLogInfo(input, { route: route.name, pathVars });
  const inputB = { ...inputA, route: route.name, pathVars };

  const response = await nextFunc(inputB);
  return response;
};

module.exports = {
  router,
};
