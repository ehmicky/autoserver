'use strict';

const { version: nodeVersion } = require('process');

const { version: apiengineVersion } = require('../../package.json');

// Retrieve environment-specific versions
const getVersionsInfo = function () {
  const apiengine = `v${apiengineVersion}`;

  return { node: nodeVersion, apiengine };
};

module.exports = {
  getVersionsInfo,
};
