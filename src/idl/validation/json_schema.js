'use strict';

const { getValidator } = require('../../validation');

// Validates that idl.models.MODEL are valid JSON schema by compiling them
// with AJV
const validateJsonSchema = function (idl) {
  return Object.values(idl.models).reduce(
    (idlA, model) => {
      getValidator({ schema: model });
      return idlA;
    },
    idl,
  );
};

module.exports = {
  validateJsonSchema,
};
