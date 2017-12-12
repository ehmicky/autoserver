'use strict';

const { validator } = require('./validator');
const { getCustomValidator } = require('./custom_validator');

// Compile JSON schema
const compile = function ({ config, jsonSchema }) {
  const validatorA = config ? getCustomValidator({ config }) : validator;
  const compiledJsonSchema = validatorA.compile(jsonSchema);
  return compiledJsonSchema;
};

module.exports = {
  compile,
};
