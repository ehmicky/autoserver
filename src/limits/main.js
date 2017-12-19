'use strict';

const SYSTEM_LIMITS = require('./system');
const { getConfigLimits } = require('./config');

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({ config } = {}) {
  const configLimits = getConfigLimits({ config });

  return { ...SYSTEM_LIMITS, ...configLimits };
};

module.exports = {
  getLimits,
};
