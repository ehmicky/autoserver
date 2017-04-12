'use strict';


const { toSentence: sentence } = require('underscore.string');
const pluralize = require('pluralize');

const { EngineError } = require('../error');


// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, type }) {
  // Retrieve error message as string, from error objects
  const extraNewline = errors.length > 1 ? '\n' : '';
  const errorsText = extraNewline + errors
    .map(({ error, dataVar }) => {
      let inputPath = error.dataPath;
      // Prepends argument name, e.g. `filters.attr` instead of `attr`
      const prefix = dataVar ? `/${dataVar}` : '';
      inputPath = prefix + inputPath;
      inputPath = inputPath.substr(1);
      // We use `jsonPointers` option because it is cleaner,
      // but we want dots (for properties) and brackets (for indexes) not slashes
      inputPath = inputPath
        .replace(/\/([0-9]+)/g, '[$1]')
        .replace(/\//g, '.');

      // Get custom error message
      const message = getErrorMessage({ error });
      // Prepends argument name to error message
      const errorText = `${inputPath}${message}`;
      return errorText;
    })
    .join('\n');

  throw new EngineError(errorsText, { reason: reasons[type] });
};
const reasons = {
  idl: 'IDL_VALIDATION',
  serverInputSyntax: 'INPUT_SERVER_VALIDATION',
  clientInputSyntax: 'INPUT_VALIDATION',
  clientInputMethod: 'WRONG_METHOD',
  clientInputSemantics: 'INPUT_VALIDATION',
  clientInputData: 'INPUT_VALIDATION',
  serverOutputSyntax: 'OUTPUT_VALIDATION',
  serverOutputData: 'OUTPUT_VALIDATION',
};

// Customize error messages when the library's ones are unclear
const getErrorMessage = function({ error }) {
  const customErrorMessage = errorMessages[error.keyword];
  return customErrorMessage ? customErrorMessage(error) : ` ${error.message}`;
};

// List of custom error messages getters
const errorMessages = {
  type: ({ params: { type } }) => ` must be ${type}`,
  format: ({ params: { format } }) => ` must match format '${format}'`,
  enum: ({ params: { allowedValues } }) => ` must be one of ${sentence(allowedValues.map(val => `'${val}'`), ', ', ' or ')}`,
  const: ({ schema }) => ` must be equal to '${schema}'`,
  multipleOf: ({ params: { multipleOf } }) => ` must be multiple of ${multipleOf}`,
  maximum: ({ params: { limit, comparison } }) => ` must be less than ${comparison === '<=' ? 'or equal to ' : ''}${limit}`,
  minimum: ({ params: { limit, comparison } }) =>
    ` must be greater than ${comparison === '>=' ? 'or equal to ' : ''}${limit}`,
  formatMinimum: ({ params: { limit, comparison }, parentSchema: { format } }) => {
    const isDate = ['date', 'date-time'].includes(format);
    const isTime = ['time'].includes(format);
    const comparative = isDate ? 'more recent' : isTime ? 'later' : 'greater';
    return ` must be ${comparative} than ${comparison === '>=' ? 'or equal to ' : ''}${limit}`;
  },
  formatMaximum: ({ params: { limit, comparison }, parentSchema: { format } }) => {
    const isDate = ['date', 'date-time'].includes(format);
    const isTime = ['time'].includes(format);
    const comparative = isDate ? 'older' : isTime ? 'sooner' : 'less';
    return ` must be ${comparative} than ${comparison === '>=' ? 'or equal to ' : ''}${limit}`;
  },
  minLength: ({ params: { limit } }) => ` must be at least ${pluralize('character', limit, true)} long`,
  maxLength: ({ params: { limit } }) => ` must be at most ${pluralize('character', limit, true)} long`,
  pattern: ({ params: { pattern } }) => ` must match pattern '${pattern}'`,
  contains: () => ' must contain at least one valid item',
  minItems: ({ params: { limit } }) => ` must contains at least ${pluralize('item', limit, true)}`,
  maxItems: ({ params: { limit } }) => ` must contains at most ${pluralize('item', limit, true)}`,
  uniqueItems: ({ params: { i, j } }) => ` must not contain any duplicated item, but items number ${j} and ${i} are identical`,
  minProperties: ({ params: { limit } }) => ` must have ${limit} or more ${pluralize('property', limit)}`,
  maxProperties: ({ params: { limit } }) => ` must have ${limit} or less ${pluralize('property', limit)}`,
  required: ({ params: { missingProperty } }) => `.${missingProperty} must be defined`,
  additionalProperties: ({ params: { additionalProperty } }) =>
    `.${additionalProperty} must not be defined, as it is not specified by this model`,
  propertyNames: ({ params: { propertyName } }) => ` property '${propertyName}' name must be valid`,
  dependencies: ({ params: { missingProperty, property } }) =>
    `.${missingProperty} must be defined when property '${property} is defined`,
  // Custom keywords
  hasPlural: ({ data }) => ` '${data}' must be an English word whose plural form differs from its singular form`,
  // Special keyword for schema that are `false`, e.g. `patternProperties: { pattern: false }`
  'false schema': () => ' must not be defined',
};


module.exports = {
  reportErrors,
};
