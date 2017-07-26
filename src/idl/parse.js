'use strict';

const { makeImmutable } = require('../utilities');
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
const getIdl = async function ({ serverOpts, serverOpts: { conf } }) {
  const initialInput = { serverOpts, idl: conf };
  const [{ idl: newIdl }, measures] = await monitoredReduce({
    funcs: processors,
    initialInput,
    category: 'idl',
    mapResponse: idl => ({ serverOpts, idl }),
  });

  makeImmutable(newIdl);

  return [{ idl: newIdl }, measures];
};

module.exports = {
  getIdl,
};
