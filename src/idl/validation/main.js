'use strict';

const { monitoredReduce } = require('../../perf');

const { validateIdlCircularRefs } = require('./circular_refs');
const { validateData } = require('./data');
const { validateIdlSyntax } = require('./syntax');
const { validateJsonSchema } = require('./json_schema');
const { validateIdlJsl } = require('./jsl');

// Make sure validators are run in a specific order
const validators = [
  validateIdlCircularRefs,
  validateData,
  validateIdlSyntax,
  validateJsonSchema,
  validateIdlJsl,
];

// Validate IDL definition
const validateIdl = function ({ idl: oIdl }) {
  return monitoredReduce({
    funcs: validators,
    initialInput: oIdl,
    category: 'validate',
  });
};

module.exports = {
  validateIdl,
};
