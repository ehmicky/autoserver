'use strict';


const { chain } = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', jsonPointers: true, full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties' ]);

const { memoize } = require('./memoize');
const { reportErrors } = require('./report_error');


const getValidator = memoize(function ({ schema }) {
  return ajv.compile(schema);
});

/**
 * Perform a validation, using a JSON schema, and a `data` as input
 * Arguments:
 *   {object} schema - JSON schema
 *   {object|object[]} data
 *   {any} data[].elem - data to validate
 *   {object} data[].dataVar - variable name, used by error reporter
 *   {string} type - type of validation, used by error reporter
 **/
const validate = function ({ schema, data, type }) {
  // Retrieves validation library
  const validator = getValidator({ schema });

  data = data instanceof Array ? data : [data];
  const errors = chain(data)
    .map(({ elem, dataVar }) => {
      const isValid = validator(elem);
      if (isValid) { return; }
      // Add variable name of each error, so it can be used in error messages
      return validator.errors.map(error => ({ error, dataVar }));
    })
    .flatten()
    .compact()
    .value();

  if (errors.length === 0) { return; }
  reportErrors({ errors, type });
};


module.exports = {
  validate,
};
