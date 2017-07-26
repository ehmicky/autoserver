'use strict';

const { monitoredReduce } = require('../perf');

const { getIdlConf } = require('./conf');
const { resolveRefs } = require('./ref_parsing');
const { applyPlugins } = require('./plugins');
const { validateIdl } = require('./validation');
const { normalizeIdl } = require('./normalize');
const { addCustomKeywords } = require('./custom_validation');

const processors = [
  // Retrieve raw IDL file
  getIdlConf,
  // Resolve JSON references
  resolveRefs,
  // Apply idl.plugins
  applyPlugins,
  // Validate IDL correctness
  validateIdl,
  // Transform IDL to normalized form, used by application
  normalizeIdl,
  // Add custom validation keywords, from idl.validation
  addCustomKeywords,
];

// Retrieves IDL definition, after validation and transformation
const getIdl = function ({ serverOpts, serverOpts: { conf } }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { idl: conf },
    category: 'idl',
    mapInput: ({ idl }) => ({ serverOpts, idl }),
    mapResponse: idl => ({ idl }),
  });
};

module.exports = {
  getIdl,
};
