'use strict';

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
const validateIdl = async function ({ idl }) {
  const validatedIdl = await validators.reduce(
    async (newIdl, validator) => validator(await newIdl),
    idl,
  );
  return validatedIdl;
};

module.exports = {
  validateIdl,
};
