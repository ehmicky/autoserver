'use strict';


const { chain } = require('lodash');


// Perform actual validation, returning all error objects as array
const validateAll = function ({ validator, attributes }) {
  return chain(attributes)
    .map(({ attrs, argName }) => validate({ validator, attrs, argName }))
    .flatten()
    .compact()
    .value();
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
