'use strict';

const { validator } = require('./validator');
const { getCustomValidator } = require('./custom_validator');

// Compile JSON schema
const compile = function ({ schema, jsonSchema }) {
  const validatorA = schema ? getCustomValidator({ schema }) : validator;
  const compiledJsonSchema = validatorA.compile(jsonSchema);
  return compiledJsonSchema;
};

module.exports = {
  compile,
};
