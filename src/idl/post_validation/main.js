'use strict';

const { idlReducer } = require('../reducer');
const { validateIdlCircularRefs } = require('../circular_refs');

const { validateJsonSchema } = require('./json_schema');
const { validateInlineFuncs } = require('./inline_func');

const validators = [
  validateIdlCircularRefs,
  validateInlineFuncs,
  validateJsonSchema,
];

// Validate IDL definition
const postValidateIdl = idlReducer.bind(null, validators);

module.exports = {
  postValidateIdl,
};
