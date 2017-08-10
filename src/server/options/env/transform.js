'use strict';

const { camelize } = require('underscore.string');

const { parsePositiveInt, transtype } = require('../../../utilities');

const { ENV_VARS_PREFIX, basicNamesMap } = require('./constants');

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
  const nameA = basicNamesMap[name];
  if (!nameA) { return; }

  return { name: nameA };
};

// Normalize variable name case
const camelizeName = function ({ name }) {
  const nameA = name
    .split('__')
    .map(namePart => {
      const namePartA = namePart.toLowerCase();
      return camelize(namePartA, true);
    })
    .join('__');
  return { name: nameA };
};

// Transtype number and boolean values from string
const transtypeValues = function ({ value }) {
  const valueA = transtype(value);
  return { value: valueA };
};

// Transtype object and array values using `__VAR` or `__NUM` in variable name
const applyNesting = function ({ name, value }) {
  const keys = name.split('__');
  if (keys.length === 1) { return; }

  const valueB = keys
    .slice(1)
    .reduceRight(getObjectOrArray, value);
  return { value: valueB };
};

const getObjectOrArray = function (value, key) {
  const index = parsePositiveInt(key);

  if (index !== undefined) {
    return [...Array(index), value];
  }

  return { [key]: value };
};

// Remove `__VAR` or `__NUM` in variable name
const removeNestedName = function ({ name }) {
  const nameA = name.replace(/__.*/, '');
  return { name: nameA };
};

const transformers = [
  removePrefix,
  applyBasicName,
  camelizeName,
  transtypeValues,
  applyNesting,
  removeNestedName,
];

module.exports = {
  transformEnvVars,
};
