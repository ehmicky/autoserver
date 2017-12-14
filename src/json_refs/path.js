'use strict';

const { resolve, dirname } = require('path');

const { addGenErrorHandler } = require('../error');

// Resolve JSON reference path to an absolute local file
const getPath = function ({ path, parentPath }) {
  if (NODE_REGEXP.test(path)) {
    return eGetModulePath({ path });
  }

  // Same file
  if (path === '') {
    return parentPath;
  }

  // Local file
  const parentDir = dirname(parentPath);
  return resolve(parentDir, path);
};

// Node module, e.g. $ref: 'lodash.node'
const getModulePath = function ({ path }) {
  const moduleName = path.replace(NODE_REGEXP, '');
  const pathA = require.resolve(moduleName);
  return pathA;
};

const NODE_REGEXP = /\.node$/;

const eGetModulePath = addGenErrorHandler(getModulePath, {
  message: ({ value }) =>
    `JSON reference '${value}' is invalid: this Node.js module does not exist`,
  reason: 'CONF_VALIDATION',
});

module.exports = {
  getPath,
};
