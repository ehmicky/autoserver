'use strict';

const { monitoredReduce } = require('../../perf');

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
  return monitoredReduce({
    funcs: normalizers,
    initialInput: idl,
    category: 'pre_normalize',
    mapInput: idlA => ({ idl: idlA }),
  });
};

module.exports = {
  preNormalizeIdl,
};
