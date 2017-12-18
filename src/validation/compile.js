'use strict';

const { getCustomValidator } = require('./custom_validator');

// Compile JSON schema
const compile = function ({ config, jsonSchema }) {
  const validator = getCustomValidator({ config });
  const compiledJsonSchema = validator.compile(jsonSchema);
  return compiledJsonSchema;
};

module.exports = {
  compile,
};
