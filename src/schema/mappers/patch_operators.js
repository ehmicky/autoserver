'use strict';

const { mapValues, flatten, uniq } = require('../../utilities');

// Parse `operators.attribute|argument` `any`
const normalizePatchOperators = function ({ schema, schema: { operators } }) {
  if (operators === undefined) { return schema; }

  const operatorsA = mapValues(operators, normalizePatchOperator);

  return { ...schema, operators: operatorsA };
};

const normalizePatchOperator = function (operator) {
  const field = normalizeField({ operator, name: 'attribute' });
  return { ...operator, ...field };
};

const normalizeField = function ({ operator, name }) {
  const { [name]: field } = operator;
  if (field === undefined) { return; }

  const types = TYPES[name];
  const fieldA = field.map(type => types[type] || type);
  const fieldB = flatten(fieldA);
  const fieldC = uniq(fieldB);
  return { [name]: fieldC };
};

const TYPES = {
  attribute: {
    any: ['boolean', 'integer', 'number', 'string'],
    'any[]': ['boolean[]', 'integer[]', 'number[]', 'string[]'],
  },
  argument: {
    any: ['boolean', 'integer', 'number', 'string', 'empty', 'object'],
    'any[]': [
      'boolean[]',
      'integer[]',
      'number[]',
      'string[]',
      'empty[]',
      'object[]',
    ],
  },
};

module.exports = {
  normalizePatchOperators,
};
