'use strict';

const { monitoredReduce } = require('../../perf');

const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { applyModelDefault } = require('./model_default');

const normalizers = [
  // Resolve JSON references
  resolveRefs,
  // Apply idl.plugins
  applyPlugins,
  // Apply idl.default
  applyModelDefault,
];

// Normalize IDL definition
const preNormalizeIdl = function ({ idl, serverOpts }) {
  return monitoredReduce({
    funcs: normalizers,
    initialInput: idl,
    category: 'pre_normalize',
    mapInput: idlA => ({ serverOpts, idl: idlA }),
  });
};

module.exports = {
  preNormalizeIdl,
};
