'use strict';

const { camelize } = require('underscore.string');

const { transtype } = require('../../utilities');

const { ENV_VARS_PREFIX, BASIC_NAMES_MAP } = require('./constants');

// Apply all transformers
const transformEnvVars = function ({ envVars }) {
  return transformers.reduce(
    (envVarsA, transformer) => transform({ envVars: envVarsA, transformer }),
    envVars,
  );
};

const transform = function ({ envVars, transformer }) {
  return envVars.map(envVar => ({ ...envVar, ...transformer(envVar) }));
};

// Remove namespace
const removePrefix = function ({ name }) {
  const nameA = name.replace(ENV_VARS_PREFIX, '');
  return { name: nameA };
};

// Apply shortcuts
const applyBasicName = function ({ name }) {
  const nameA = BASIC_NAMES_MAP[name];
  if (!nameA) { return; }

  return { name: nameA };
};

// Normalize variable name case
const camelizeName = function ({ name }) {
  const nameA = name
    .split('_')
    .map(namePart => {
      const namePartA = namePart.toLowerCase();
      return camelize(namePartA, true);
    })
    .join('_');
  return { name: nameA };
};

// Parse array values from a string to an actual array
const parseArrays = function ({ value }) {
  const isArray = typeof value === 'string' &&
    value.startsWith('[') &&
    value.endsWith(']');
  if (!isArray) { return; }

  const parts = value
    .slice(1, -1)
    .split(ARRAY_REGEXP);
  return { value: parts };
};

// Splits elements in '[value  , value2, value3]' string
const ARRAY_REGEXP = /\s*,\s*/g;

// Transtype number and boolean values from string
const transtypeValues = function ({ value }) {
  const valueA = getTranstypedValue({ value });
  return { value: valueA };
};

const getTranstypedValue = function ({ value }) {
  if (Array.isArray(value)) {
    return value.map(transtype);
  }

  return transtype(value);
};

// Transtype object and array values using `_VAR` in variable name
const applyNesting = function ({ name, value }) {
  const keys = name.split('_');
  if (keys.length === 1) { return; }

  const valueB = keys
    .slice(1)
    .reduceRight(
      (valueA, key) => ({ [key]: valueA }),
      value,
    );
  return { value: valueB };
};

// Remove `_VAR` in variable name
const removeNestedName = function ({ name }) {
  const nameA = name.replace(/_.*/, '');
  return { name: nameA };
};

const transformers = [
  removePrefix,
  applyBasicName,
  camelizeName,
  parseArrays,
  transtypeValues,
  applyNesting,
  removeNestedName,
];

module.exports = {
  transformEnvVars,
};
