'use strict';

const pathToRegExp = require('path-to-regexp');

const { mapValues, assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');
const { operationHandlers } = require('../../../operations');

const getRoutes = function () {
  const paths = mapValues(operationHandlers, normalizeRoute);
  return Object.values(paths)
    .reduce(assignArray, [])
    .map(getRoute);
};

const normalizeRoute = function ({ paths }, operation) {
  return paths.map(path => ({ path, operation }));
};

const getRoute = function ({ path, operation }) {
  const regexp = pathToRegExp(path);
  const variables = regexp.keys.map(key => key.name);

  return { path, operation, regexp, variables };
};

const routes = getRoutes();

// Retrieves correct route, according to path
const findRoute = function ({ path }) {
  const route = routes.find(({ regexp }) => regexp.test(path));

  if (route === undefined) {
    const message = 'The requested URL was not found';
    throwError(message, { reason: 'NOT_FOUND' });
  }

  return route;
};

module.exports = {
  findRoute,
};
