'use strict';

const { assignArray } = require('../utilities');

const { reportErrors } = require('./report_error');
const { compile } = require('./compile');

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
const validate = function ({ schema, data, reportInfo, extra, idl }) {
  const compiledSchema = compile({ idl, schema });
  const dataWithExtra = getDataWithExtra({ data, extra });
  const isValid = compiledSchema(dataWithExtra);
  if (isValid) { return; }

  const errors = compiledSchema.errors
    .reduce(assignArray, [])
    .filter(val => val);

  if (errors.length === 0) { return; }
  reportErrors({ errors, reportInfo });
};

const getDataWithExtra = function ({ data, extra }) {
  if (!extra) { return data; }

  // Temporarily add hidden property to data, to communicate it to
  // custom validation function
  return { ...data, [Symbol.for('extra')]: extra };
};

module.exports = {
  validate,
};
