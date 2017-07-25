'use strict';

const { getValidator } = require('../../validation');

// Validates that idl.models.MODEL are valid JSON schema by compiling them
// with AJV
const validateJsonSchema = function (idl) {
  for (const model of Object.values(idl.models)) {
    getValidator({ schema: model });
  }

  return idl;
};

module.exports = {
  validateJsonSchema,
};
