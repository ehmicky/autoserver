'use strict';

const { getValues } = require('../utilities');

// Recursively find all the JSON references
const findRefs = function ({ content }) {
  return getValues(content)
    .filter(isRef)
    .map(removeLastPath);
};

const isRef = function ({ value, keys }) {
  return typeof value === 'string' && keys[keys.length - 1] === '$ref';
};

// Remove `$ref` from keys
const removeLastPath = function ({ value, keys }) {
  const keysA = keys.slice(0, -1);
  return { value, keys: keysA };
};

module.exports = {
  findRefs,
};
