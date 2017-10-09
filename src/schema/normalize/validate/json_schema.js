'use strict';

const { addGenErrorHandler } = require('../../../error');
const { compile } = require('../../../json_validation');
const { compileSchemaFuncs } = require('../../../schema_func');

// Validates that `attr.validate` are valid JSON schema
// by compiling them with AJV
const validateJsonSchema = function ({
  schema,
  schema: { shortcuts: { validateMap } },
}) {
  const schemaA = compileSchemaFuncs({ schema });
  compile({ jsonSchema: validateMap, schema: schemaA });

  return schema;
};

const eValidateJsonSchema = addGenErrorHandler(validateJsonSchema, {
  message: 'Invalid JSON schema in \'validate\' property',
  reason: 'SCHEMA_VALIDATION',
});

module.exports = {
  validateJsonSchema: eValidateJsonSchema,
};
