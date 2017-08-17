'use strict';

const { makeImmutable } = require('../utilities');

const { getHelpers } = require('./helpers');

// Create initial ifv object
const createIfv = function ({ idl: { helpers = {} } }) {
  const paramsRef = {};
  const helpersA = getHelpers({ helpers, paramsRef });
  const ifv = { params: helpersA, paramsRef };
  return { ifv };
};

// Add IDL functions variables
const addOnlyIfv = function (ifv, params) {
  const { params: paramsA } = ifv;
  const paramsB = makeImmutable(params);
  return { ...ifv, params: { ...paramsA, ...paramsB } };
};

// Helper function aroung addOnlyIfv()
const addIfv = function (obj, params) {
  const { ifv } = obj;
  const ifvA = addOnlyIfv(ifv, params);
  return { ...obj, ifv: ifvA };
};

module.exports = {
  createIfv,
  addOnlyIfv,
  addIfv,
};
