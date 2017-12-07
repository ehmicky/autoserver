'use strict';

const { getValues } = require('../utilities');

// Recursively find all the JSON references
const findRefs = function ({ content }) {
  return getValues(content).filter(isRef);
};

const isRef = function ({ value, keys }) {
  return typeof value === 'string' && keys[keys.length - 1] === '$ref';
};

module.exports = {
  findRefs,
};
