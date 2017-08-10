'use strict';

const { reduceAsync } = require('../utilities');

const { getIdlConf } = require('./conf');
const { preNormalizeIdl } = require('./pre_normalize');
const { preValidateIdl } = require('./pre_validation');
const { postNormalizeIdl } = require('./post_normalize');
const { postValidateIdl } = require('./post_validation');

const processors = [
  // Retrieve raw IDL file
  getIdlConf,
  // Transform IDL to normalized form, before validation
  preNormalizeIdl,
  // Validate IDL correctness
  preValidateIdl,
  // Transform IDL to normalized form, used by application
  postNormalizeIdl,
  // Validate IDL correctness, after final normalization
  postValidateIdl,
];

// Retrieves IDL definition, after validation and transformation
const getIdl = function ({ idlPath }) {
  return reduceAsync(processors, (idl, func) => func({ idlPath, idl }), {});
};

module.exports = {
  getIdl,
};
