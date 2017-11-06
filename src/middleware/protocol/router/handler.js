'use strict';

const { operationHandlers } = require('../../../operations');

const { findRoute } = require('./routes');
const { getPathvars } = require('./pathvars');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const route = findRoute({ path });
  const { operation } = route;
  const operationHandler = operationHandlers[operation];

  const pathvars = getPathvars({ path, route });

  return { operation, operationHandler, pathvars };
};

module.exports = {
  router,
};
