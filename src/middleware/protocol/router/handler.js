'use strict';

const { operationHandlers } = require('../../../operations');

const { findRoute } = require('./routes');
const { getPathVars } = require('./path_vars');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const route = findRoute({ path });
  const { operation } = route;
  const operationHandler = operationHandlers[operation];

  const pathVars = getPathVars({ path, route });

  return { operation, operationHandler, pathVars };
};

module.exports = {
  router,
};
