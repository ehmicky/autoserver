'use strict';


const { chain } = require('lodash');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
  full: true,
  $data: true,
  verbose: true,
  multipleOfPrecision: 9,
});
const { singular, plural } = require('pluralize');

const { memoize } = require('./memoize');
const { reportErrors } = require('./report_error');


const addKeywords = function (ajv) {
  // Add future JSON standard keywords
  ajvKeywords(ajv, [ 'if', 'formatMinimum', 'formatMaximum' ]);
  // Add custom keywords
  // Checks that a word (e.g. a model) is an English word with a different singular and plural form
  ajv.addKeyword('hasPlural', {
    validate(schemaValue, data) {
      if (!schemaValue) { return true; }
      return singular(data) !== plural(data);
    },
    type: 'string',
    $data: true,
  });
};
addKeywords(ajv);


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
