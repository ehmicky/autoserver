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
 *   {any} data - data to validate
 *   {object} reportInfo - information used by error reporter
 *   {string} reportInfo.type - type of validation
 *   {string} [reportInfo.dataVar] - variable name
 *   {string} [reportInfo.operation]
 *   {string} [reportInfo.modelName]
 **/
const validate = function ({ schema, data, reportInfo }) {
  // Retrieves validation library
  const validator = getValidator({ schema });

  const isValid = validator(data);
  if (isValid) { return; }

  const errors = chain(validator.errors)
    .flatten()
    .compact()
    .value();

  if (errors.length === 0) { return; }
  reportErrors({ errors, reportInfo });
};


module.exports = {
  validate,
};
