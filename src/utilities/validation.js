'use strict';


const { chain } = require('lodash');
const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const { singular, plural } = require('pluralize');

const { memoize } = require('./memoize');
const { reportErrors } = require('./report_error');


let ajv;
// Builds ajv instance
const buildValidator = function () {
  ajv = new Ajv({
    allErrors: true,
    jsonPointers: true,
    full: true,
    $data: true,
    verbose: true,
    multipleOfPrecision: 9,
  });
  addKeywords();
};

const addKeywords = function () {
  // Add future JSON standard keywords
  ajvKeywords(ajv, ['if', 'formatMinimum', 'formatMaximum', 'typeof']);
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

const getRawValidator = () => ajv;

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
 *   {string} [reportInfo.action]
 *   {string} [reportInfo.modelName]
 *   {any} [extra] - custom information passed to custom validation functions
 **/
const validate = function ({ schema, data, reportInfo, extra }) {
  // Retrieves validation library
  const validator = getValidator({ schema });

  // Temporarily add hidden property to data, to communicate it to custom validation function
  if (extra) {
    data = Object.assign({}, data, { [Symbol.for('extra')]: extra });
  }
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
  getValidator,
  getRawValidator,
  buildValidator,
  validate,
};
