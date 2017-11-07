'use strict';

const { parse, tokensToRegExp } = require('path-to-regexp');

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');
const { rpcHandlers } = require('../../../rpc');

// Retrieve all routes regexps, rpc and variable names
const getAllRoutes = function () {
  return Object.values(rpcHandlers)
    .map(getRoutes)
    .reduce(assignArray, []);
};

const getRoutes = function ({ routes, name: rpc }) {
  return routes
    .map(parseRoute)
    .map(route => ({ ...route, rpc }));
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
