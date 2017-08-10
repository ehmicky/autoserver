'use strict';

const { reduceAsync } = require('../../utilities');

const { validateIdlCircularRefs } = require('./circular_refs');
const { validateData } = require('./data');
const { validateModelNames } = require('./model_names');
const { validateIdlSyntax } = require('./syntax');
const { validateIdlJsl } = require('./jsl');

// Make sure validators are run in a specific order
const validators = [
  validateIdlCircularRefs,
  validateData,
  validateModelNames,
  validateIdlSyntax,
  validateIdlJsl,
];

// Validate IDL definition
const validateIdl = function ({ idl }) {
  return reduceAsync(validators, (idlA, func) => func({ idl: idlA }), idl);
};

module.exports = {
  validateIdl,
};
