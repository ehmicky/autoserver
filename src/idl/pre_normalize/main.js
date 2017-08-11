'use strict';

const { idlReducer } = require('../reducer');

const { applyPlugins } = require('./plugins');
const { applyModelDefault } = require('./model_default');

const normalizers = [
  // Apply idl.plugins
  applyPlugins,
  // Apply idl.default
  applyModelDefault,
];

// Normalize IDL definition
const preNormalizeIdl = idlReducer.bind(null, normalizers);

module.exports = {
  preNormalizeIdl,
};
