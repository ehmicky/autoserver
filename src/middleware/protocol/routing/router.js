'use strict';

const { EngineError } = require('../../../error');
const { makeImmutable } = require('../../../utilities');

const { routes, findRoute, getPathVars } = require('./manager');

// Add route and URL parameters to input
const router = async function (input) {
  const { path, goal, log } = input;

  const route = findRoute({ routes, path, goal });

  if (!route) {
    const message = 'The requested URL was not found';
    throw new EngineError(message, { reason: 'NOT_FOUND' });
  }

  const pathVars = getPathVars({ path, route });
  makeImmutable(pathVars);

  log.add({ route: route.name, pathVars });
  Object.assign(input, { route: route.name, pathVars });

  const response = await this.next(input);
  return response;
};

module.exports = {
  router,
};
