'use strict';

const { expandPath, has, set } = require('../../utilities');

// Add schema default values
const addDefaults = function ({ schema }) {
  const schemaA = DEFAULT_VALUES.reduce(expandPaths, schema);
  return schemaA;
};

// Expand `*` in paths
const expandPaths = function (schema, { key, value }) {
  const keys = expandPath(schema, key);
  const schemaB = keys.reduce(
    (schemaA, keyA) => applyDefaultValue({ schema: schemaA, key: keyA, value }),
    schema,
  );
  return schemaB;
};

const applyDefaultValue = function ({ schema, key, value }) {
  const keyA = key.split('.');

  if (has(schema, keyA)) { return schema; }

  return set(schema, keyA, value);
};

// Order matters, as they are applied serially
const DEFAULT_VALUES = [
  { key: 'collections.*.database', value: 'memory' },
  {
    key: 'collections.*.attributes.id',
    value: { description: 'Unique identifier' },
  },
  { key: 'collections.*.attributes.*.type', value: 'string' },
  { key: 'collections.*.attributes.*.validate', value: {} },
];

module.exports = {
  addDefaults,
};
