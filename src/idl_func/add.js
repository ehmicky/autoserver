'use strict';

const { getHelpers } = require('./helpers');

// Create initial ifv object
const createIfv = function ({ idl: { helpers = {} } }) {
  const paramsRef = {};
  const helpersA = getHelpers({ helpers, paramsRef });
  const ifv = {};
  return { ifv, paramsRef, helpers: helpersA };
};

// Add IDL functions variables
const addIfv = function (ifv, params) {
  return { ...ifv, ...params };
};

// TODO: enable this again
// const paramsB = makeImmutable(params);

module.exports = {
  createIfv,
  addIfv,
};
