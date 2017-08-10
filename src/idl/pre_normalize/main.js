'use strict';

const { reduceAsync } = require('../../utilities');

const { applyPlugins } = require('./plugins');
const { applyModelDefault } = require('./model_default');

const normalizers = [
  // Apply idl.plugins
  applyPlugins,
  // Apply idl.default
  applyModelDefault,
];

// Normalize IDL definition
const preNormalizeIdl = function ({ idl }) {
  return reduceAsync(normalizers, (idlA, func) => func({ idl: idlA }), idl);
};

module.exports = {
  preNormalizeIdl,
};
