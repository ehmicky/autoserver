'use strict';

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

const getValidator = function () {
  const ajv = new Ajv(AJV_OPTIONS);

  // Add future JSON standard keywords
  ajvKeywords(ajv, ['if', 'typeof']);

  return ajv;
};

const AJV_OPTIONS = {
  allErrors: true,
  jsonPointers: true,
  full: true,
  $data: true,
  verbose: true,
  multipleOfPrecision: 9,
  extendRefs: true,
};

const validator = getValidator();

module.exports = {
  validator,
};
