'use strict';

const { validator } = require('./validator');
const { getCustomValidator } = require('./custom_validator');

// Compile JSON schema
const compile = function ({ idl, jsonSchema }) {
  const validatorA = idl ? getCustomValidator({ idl }) : validator;
  const compiledJsonSchema = validatorA.compile(jsonSchema);
  return compiledJsonSchema;
};

module.exports = {
  compile,
};
