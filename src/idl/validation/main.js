'use strict';

const { reduceAsync } = require('../../utilities');

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
const validateIdl = function ({ idl: oIdl, startupLog }) {
  return reduceAsync(validators, async (idl, validator) => {
    const perf = startupLog.perf.start(validator.name, 'validate');
    const newIdl = await validator(idl);
    perf.stop();
    return newIdl;
  }, oIdl);
};

module.exports = {
  validateIdl,
};
