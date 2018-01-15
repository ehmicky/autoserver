'use strict';

const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

const getValidator = function () {
  const ajv = new Ajv(AJV_OPTIONS);

  // Add JSON keywords:
  //  - typeof: allows checking for `typeof function`
  ajvKeywords(ajv, ['typeof']);

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
