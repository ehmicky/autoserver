'use strict';

const { resolve } = require('path');

const { addGenErrorHandler } = require('../error');

// Resolve JSON reference path to an absolute local file
const getPath = function ({ dir, value }) {
  if (NODE_REGEXP.test(value)) {
    return eGetModulePath({ value });
  }

  // Local file
  return resolve(dir, value);
};

// Node module, e.g. $ref: 'lodash.node'
const getModulePath = function ({ value }) {
  const moduleName = value.replace(NODE_REGEXP, '');
  const path = require.resolve(moduleName);
  return path;
};

const NODE_REGEXP = /\.node$/;

const eGetModulePath = addGenErrorHandler(getModulePath, {
  message: ({ value }) =>
    `JSON reference '${value}' is invalid: this Node.js module does not exist`,
  reason: 'SCHEMA_SYNTAX_ERROR',
});

module.exports = {
  getPath,
};
