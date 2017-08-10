'use strict';

const { reduceAsync } = require('../../utilities');
const { validateIdlCircularRefs } = require('../circular_refs');

const validators = [
  validateIdlCircularRefs,
];

// Validate IDL definition
const postValidateIdl = function ({ idl }) {
  return reduceAsync(validators, (idlA, func) => func({ idl: idlA }), idl);
};

module.exports = {
  postValidateIdl,
};
