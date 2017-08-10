'use strict';

const { getEnvVars } = require('../env');

// Try to either: get directly passed path,
// or find it from environment variables
const getDirectPath = function ({ path, name }) {
  if (path) { return path; }

  const envVars = getEnvVars();
  const envVar = envVars[name];
  if (envVar) { return envVar; }
};

module.exports = {
  getDirectPath,
};
