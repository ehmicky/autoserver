'use strict';

const {
  validateIdlCircularRefs,
  validateData,
  validateIdlSyntax,
  validateJsonSchema,
  validateIdlJsl,
} = require('./validators');

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
