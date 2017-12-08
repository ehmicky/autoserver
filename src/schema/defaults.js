'use strict';

const { expandPath, has, set, deepMerge } = require('../utilities');
const { protocolAdapters } = require('../protocols');
const { databaseAdapters, DEFAULT_DATABASE } = require('../database');

// Add schema default values
const addDefaults = function ({ schema }) {
  const schemaA = DEFAULT_VALUES.reduce(expandPaths, schema);
  const schemaB = Object.values(databaseAdapters)
    .reduce(setDynamicDefaults.bind(null, 'databases'), schemaA);
  const schemaC = Object.values(protocolAdapters)
    .reduce(setDynamicDefaults.bind(null, 'protocols'), schemaB);
  return schemaC;
};

// Order matters, as they are applied serially
// This is why we are not using a simple object to deeply merge
const DEFAULT_VALUES = [
  { key: 'env', value: 'dev' },
  { key: 'collections.*.database', value: DEFAULT_DATABASE.name },
  {
    key: 'collections.*.attributes.id',
    value: { description: 'Unique identifier' },
  },
  { key: 'collections.*.attributes.*.type', value: 'string' },
  { key: 'collections.*.attributes.*.validate', value: {} },
  { key: 'log', value: [] },
  { key: 'databases', value: {} },
  { key: 'limits', value: {} },
  { key: 'limits.maxpayload', value: '10MB' },
  { key: 'limits.pagesize', value: 100 },
];

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

// Set `schema.protocols|databases` default values using each
// `protocolAdapter|databaseAdapter.defaults`
const setDynamicDefaults = function (prop, schema, { name, defaults = {} }) {
  const defaultsA = { [prop]: { [name]: defaults } };
  return deepMerge(defaultsA, schema);
};

module.exports = {
  addDefaults,
};
