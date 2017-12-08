'use strict';

const { addGenErrorHandler } = require('../../error');
const { compile } = require('../../json_validation');

// Validates that `attr.validate` are valid JSON schema
// by compiling them with AJV
const validateJsonSchema = function ({
  schema,
  schema: { shortcuts: { validateMap } },
}) {
  compile({ jsonSchema: validateMap, schema });

  return schema;
};

const eValidateJsonSchema = addGenErrorHandler(validateJsonSchema, {
  message: 'Invalid JSON schema in \'validate\' property',
  reason: 'SCHEMA_VALIDATION',
});

module.exports = {
  validateJsonSchema: eValidateJsonSchema,
};
