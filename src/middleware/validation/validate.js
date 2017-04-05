'use strict';


const { flatten } = require('lodash');


// Perform actual validation, returning all error objects as array
const validateAll = function ({ validator, attributes }) {
  const errors = attributes.map(({ attrs, argName }) => validate({ validator, attrs, argName }));
  return flatten(errors);
};

const validate = function ({ validator, attrs, argName }) {
  const isValid = validator(attrs);
  if (isValid) { return; }
  // Add `argName` to each error, so it can be used in error messages
  return validator.errors.map(error => Object.assign(error, { argName }));
};

module.exports = {
  validateAll,
};
