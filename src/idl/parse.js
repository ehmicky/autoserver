'use strict';

const { dereferenceIdl } = require('../ref_parser');

const { idlReducer } = require('./reducer');
const { preNormalizeIdl } = require('./pre_normalize');
const { preValidateIdl } = require('./pre_validation');
const { postNormalizeIdl } = require('./post_normalize');
const { postValidateIdl } = require('./post_validation');

const processors = [
  // Dereference JSON references
  dereferenceIdl,
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
const getIdl = idlReducer.bind(null, processors);

module.exports = {
  getIdl,
};
