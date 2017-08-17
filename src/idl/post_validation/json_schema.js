'use strict';

const { addErrorHandler } = require('../../error');
const { compile } = require('../../validation');
const { compileIdlFuncs } = require('../../idl_func');

// Validates that idl.models.MODEL are valid JSON schema
// by compiling them with AJV
const validateJsonSchema = function ({
  idl,
  idl: { shortcuts: { validateMap } },
}) {
  const idlA = compileIdlFuncs({ idl });
  compile({ schema: validateMap, idl: idlA });

  return idl;
};

const eValidateJsonSchema = addErrorHandler(validateJsonSchema, {
  message: 'Invalid JSON schema in \'validate\' property',
  reason: 'IDL_VALIDATION',
});

module.exports = {
  validateJsonSchema: eValidateJsonSchema,
};
