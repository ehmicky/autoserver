'use strict';

const { deepMerge, mapValues } = require('../../utilities');
const { protocolAdapters } = require('../../protocols');
const { databaseAdapters, DEFAULT_DATABASE } = require('../../database');
const { mapColls, mapAttrs } = require('../helpers');

// Add schema default values
const addDefaults = function ({ schema }) {
  const schemaA = addTopDefaults({ schema });
  const schemaB = addCollsDefaults({ schema: schemaA });
  const schemaC = addAttrsDefaults({ schema: schemaB });
  return schemaC;
};

// Top-level defaults
const addTopDefaults = function ({ schema }) {
  const dynamicDefaults = mapValues(DYNAMIC_DEFAULTS, getDynamicDefaults);
  const schemaA = deepMerge(TOP_DEFAULT_VALUES, dynamicDefaults, schema);
  return schemaA;
};

// Defaults related to adapters
const getDynamicDefaults = function (adapters) {
  return mapValues(adapters, ({ defaults = {} }) => defaults);
};

// Collection-level defaults
const addCollsDefaults = function ({ schema }) {
  const schemaA = mapColls(addCollDefaults, { schema });
  return { ...schema, ...schemaA };
};

const addCollDefaults = function ({ coll }) {
  return deepMerge(COLL_DEFAULTS, coll);
};

// Attribute-level defaults
const addAttrsDefaults = function ({ schema }) {
  const schemaA = mapAttrs(addAttrDefaults, { schema });
  return { ...schema, ...schemaA };
};

const addAttrDefaults = function ({ attr }) {
  return deepMerge(ATTR_DEFAULTS, attr);
};

const TOP_DEFAULT_VALUES = {
  env: 'dev',
  log: [],
  limits: {
    maxpayload: '10MB',
    pagesize: 100,
  },
};

const DYNAMIC_DEFAULTS = {
  databases: databaseAdapters,
  protocols: protocolAdapters,
};

const COLL_DEFAULTS = {
  database: DEFAULT_DATABASE.name,
  attributes: {
    id: { description: 'Unique identifier' },
  },
};

const ATTR_DEFAULTS = {
  type: 'string',
  validate: {},
};

module.exports = {
  addDefaults,
};
