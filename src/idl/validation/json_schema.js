'use strict';

// TODO: Re-enable this
// const { getValidator } = require('../../validation');

// Validates that idl.models.MODEL are valid JSON schema by compiling them
// with AJV
const validateJsonSchema = function (idl) {
  return idl;
  // TODO: Re-enable this
  // return Object.values(idl.models).reduce(
  //   (idlA, model) => {
  //     getValidator({ schema: model });
  //     return idlA;
  //   },
  //   idl,
  // );
};

module.exports = {
  validateJsonSchema,
};
