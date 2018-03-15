'use strict';

const { version: nodeVersion } = require('process');

const { version: autoserverVersion } = require('../../package.json');

// Retrieve environment-specific versions
const getVersionsInfo = function () {
  const autoserver = `v${autoserverVersion}`;

  return { node: nodeVersion, autoserver };
};

module.exports = {
  getVersionsInfo,
};
