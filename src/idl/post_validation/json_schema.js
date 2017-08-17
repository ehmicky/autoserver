'use strict';

const { throwError } = require('../../error');
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

const addErrorHandler = function (func) {
  return (...args) => {
    try {
      return func(...args);
    } catch (error) {
      const message = 'Invalid JSON schema in \'validate\' property';
      throwError(message, { reason: 'IDL_VALIDATION', innererror: error });
    }
  };
};

const eValidateJsonSchema = addErrorHandler(validateJsonSchema);

module.exports = {
  validateJsonSchema: eValidateJsonSchema,
};
