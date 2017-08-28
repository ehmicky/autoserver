'use strict';

const { validator } = require('./validator');
const { getCustomValidator } = require('./custom_validator');

// Compile JSON schema
const compile = function ({ idl, schema }) {
  const validatorA = idl ? getCustomValidator({ idl }) : validator;
  const compiledSchema = validatorA.compile(schema);
  return compiledSchema;
};

module.exports = {
  compile,
};
