'use strict';

const { findRoute } = require('./routes');
const { getPathVars } = require('./path_vars');

// Add route and URL parameters to mInput
const router = function ({ path }) {
  const route = findRoute({ path });
  const { operation } = route;

  const pathVars = getPathVars({ path, route });

  return { operation, pathVars };
};

module.exports = {
  router,
};
