'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../utilities');

// List of custom error messages getters
const errorMessages = {
  // JSON schema keywords for any type
  type: ({ params: { type } }) => {
    const types = type.split(',');
    const typesA = getWordsList(types, { op: 'or' });
    return ` must be ${typesA}`;
  },
  format: ({ params: { format } }) =>
    ` must match format '${format}'`,
  enum: ({ params: { allowedValues } }) => {
    const values = getWordsList(allowedValues, { quotes: true });
    return ` must be ${values}`;
  },
  const: ({ schema }) =>
    ` must be equal to '${schema}'`,

  // JSON schema keywords for `number|integer` type
  multipleOf: ({ params: { multipleOf } }) =>
    ` must be multiple of ${multipleOf}`,
  maximum: ({ params: { limit, comparison } }) => {
    const orEqualTo = comparison === '<=' ? 'or equal to ' : '';
    return ` must be less than ${orEqualTo}${limit}`;
  },
  minimum: ({ params: { limit, comparison } }) => {
    const orEqualTo = comparison === '>=' ? 'or equal to ' : '';
    return ` must be greater than ${orEqualTo}${limit}`;
  },

  // JSON schema keywords for `string` type
  minLength: ({ params: { limit } }) =>
    ` must be at least ${pluralize('character', limit, true)} long`,
  maxLength: ({ params: { limit } }) =>
    ` must be at most ${pluralize('character', limit, true)} long`,
  pattern: ({ params: { pattern } }) =>
    ` must match pattern '${pattern}'`,

  // JSON schema keywords for `array` type
  contains: () =>
    ' must contain at least one valid item',
  minItems: ({ params: { limit } }) =>
    ` must contains at least ${pluralize('item', limit, true)}`,
  maxItems: ({ params: { limit } }) =>
    ` must contains at most ${pluralize('item', limit, true)}`,
  uniqueItems: ({ params }) =>
    ` must not contain any duplicated item, but items number ${params.j} and ${params.i} are identical`,

  // JSON schema keywords for `object` type
  minProperties: ({ params: { limit } }) =>
    ` must have ${limit} or more ${pluralize('property', limit)}`,
  maxProperties: ({ params: { limit } }) =>
    ` must have ${limit} or less ${pluralize('property', limit)}`,
  required: ({ params: { missingProperty } }) =>
    `.${missingProperty} must be defined`,
  additionalProperties: ({ params: { additionalProperty } }) =>
    `.${additionalProperty} is an unknown parameter`,
  propertyNames: ({ params: { propertyName } }) =>
    ` property '${propertyName}' name must be valid`,
  dependencies: ({ params: { missingProperty, property } }) =>
    `.${missingProperty} must be defined when property '${property} is defined`,

  // Special keyword for schema that are `false`,
  // e.g. `patternProperties: { pattern: false }`
  'false schema': () =>
    ' must not be defined',
};

module.exports = {
  errorMessages,
};
