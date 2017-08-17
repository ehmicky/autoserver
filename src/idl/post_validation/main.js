'use strict';

const { idlReducer } = require('../reducer');
const { validateIdlCircularRefs } = require('../circular_refs');

const { validateJsonSchema } = require('./json_schema');
const { validateJsl } = require('./jsl');

const validators = [
  validateIdlCircularRefs,
  validateJsl,
  validateJsonSchema,
];

// Validate IDL definition
const postValidateIdl = idlReducer.bind(null, validators);

module.exports = {
  postValidateIdl,
};
