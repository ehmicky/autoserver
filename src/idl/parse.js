'use strict';

const { monitoredReduce } = require('../perf');

const { getIdlConf } = require('./conf');
const { preNormalizeIdl } = require('./pre_normalize');
const { validateIdl } = require('./validation');
const { postNormalizeIdl } = require('./post_normalize');

const processors = [
  // Retrieve raw IDL file
  getIdlConf,
  // Transform IDL to normalized form, before validation
  preNormalizeIdl,
  // Validate IDL correctness
  validateIdl,
  // Transform IDL to normalized form, used by application
  postNormalizeIdl,
];

// Retrieves IDL definition, after validation and transformation
const getIdl = function ({ idlPath }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { idlPath },
    category: 'idl',
    mapResponse: idl => ({ idl }),
  });
};

module.exports = {
  getIdl,
};
