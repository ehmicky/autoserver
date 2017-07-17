'use strict';

const { memoize, assignArray } = require('../utilities');
const { reportErrors } = require('./report_error');
const { getRawValidator } = require('./base');

const getValidator = memoize(function ({ schema }) {
  const ajv = getRawValidator();
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

  // Temporarily add hidden property to data, to communicate it to
  // custom validation function
  if (extra) {
    data = Object.assign({}, data, { [Symbol.for('extra')]: extra });
  }

  const isValid = validator(data);
  if (isValid) { return; }

  const errors = validator.errors
    .reduce(assignArray, [])
    .filter(val => val);

  if (errors.length === 0) { return; }
  reportErrors({ errors, reportInfo });
};

module.exports = {
  getValidator,
  getRawValidator,
  validate,
};
