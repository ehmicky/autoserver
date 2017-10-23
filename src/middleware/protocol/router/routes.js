'use strict';

const { parse, tokensToRegExp } = require('path-to-regexp');

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');
const { operationHandlers } = require('../../../operations');

// Retrieve all routes regexps, operations and variable names
const getAllRoutes = function () {
  return Object.values(operationHandlers)
    .map(getRoutes)
    .reduce(assignArray, []);
};

const getRoutes = function ({ routes, name: operation }) {
  return routes
    .map(parseRoute)
    .map(route => ({ ...route, operation }));
};

// Parse `/path/:var/path2/:var2` into
// `{ regexp /.../, variables: ['var', 'var2'] }`
const parseRoute = function (route) {
  const tokens = parse(route);
  const regexp = tokensToRegExp(tokens);
  const variables = getVariables({ tokens });

  return { regexp, variables };
};

const getVariables = function ({ tokens }) {
  return tokens
    .filter(token => token.constructor === Object)
    .map(({ name }) => name);
};

const allRoutes = getAllRoutes();

// Retrieves correct route, according to path
const findRoute = function ({ path }) {
  const route = allRoutes.find(({ regexp }) => regexp.test(path));
  if (route !== undefined) { return route; }

  const message = 'The requested URL was not found';
  throwError(message, { reason: 'ROUTE_NOT_FOUND' });
};

module.exports = {
  findRoute,
};
