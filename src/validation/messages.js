'use strict';

const { toSentence: sentence } = require('underscore.string');
const pluralize = require('pluralize');

// List of custom error messages getters
const errorMessages = {
  type: ({ params: { type } }) =>
    ` must be ${type}`,
  format: ({ params: { format } }) =>
    ` must match format '${format}'`,
  enum: ({ params: { allowedValues } }) => {
    const quotedValues = allowedValues.map(val => `'${val}'`);
    const values = sentence(quotedValues, ', ', ' or ');
    return ` must be one of ${values}`;
  },
  const: ({ schema }) =>
    ` must be equal to '${schema}'`,
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
  formatMinimum: ({
    params: { limit, comparison },
    parentSchema: { format },
  }) => {
    const comparatives = {
      date: 'more recent',
      'date-time': 'more recent',
      time: 'later',
    };
    const comparative = comparatives[format] || 'greater';
    const orEqualTo = comparison === '>=' ? 'or equal to ' : '';
    return ` must be ${comparative} than ${orEqualTo}${limit}`;
  },
  formatMaximum: ({
    params: { limit, comparison },
    parentSchema: { format },
  }) => {
    const comparatives = {
      date: 'older',
      'date-time': 'older',
      time: 'sooner',
    };
    const comparative = comparatives[format] || 'less';
    const orEqualTo = comparison === '>=' ? 'or equal to ' : '';
    return ` must be ${comparative} than ${orEqualTo}${limit}`;
  },
  minLength: ({ params: { limit } }) =>
    ` must be at least ${pluralize('character', limit, true)} long`,
  maxLength: ({ params: { limit } }) =>
    ` must be at most ${pluralize('character', limit, true)} long`,
  pattern: ({ params: { pattern } }) =>
    ` must match pattern '${pattern}'`,
  contains: () =>
    ' must contain at least one valid item',
  minItems: ({ params: { limit } }) =>
    ` must contains at least ${pluralize('item', limit, true)}`,
  maxItems: ({ params: { limit } }) =>
    ` must contains at most ${pluralize('item', limit, true)}`,
  uniqueItems: ({ params }) =>
    ` must not contain any duplicated item, but items number ${params.j} and ${params.i} are identical`,
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
  arity: ({ schema, data: func }) =>
    ` must have ${pluralize('argument', schema, true)} not ${func.length}`,
  // Special keyword for schema that are `false`,
  // e.g. `patternProperties: { pattern: false }`
  'false schema': () =>
    ' must not be defined',
};

module.exports = {
  errorMessages,
};
