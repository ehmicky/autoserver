'use strict';

const { idlReducer } = require('../reducer');
const { validateIdlCircularRefs } = require('../circular_refs');

const validators = [
  validateIdlCircularRefs,
];

// Validate IDL definition
const postValidateIdl = idlReducer.bind(null, validators);

module.exports = {
  postValidateIdl,
};
