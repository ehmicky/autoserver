'use strict';

const { makeImmutable } = require('../utilities');

const { getHelpers } = require('./helpers');

// Create initial JSL object, which holds JSL parameters
const createJsl = function ({ idl: { helpers = {} } }) {
  const paramsRef = {};
  const helpersA = getHelpers({ helpers, paramsRef });
  const jsl = { params: helpersA, paramsRef };
  return { jsl };
};

// Add JSL parameters to JSL object
const addOnlyJsl = function (jsl, params) {
  const { params: paramsA } = jsl;
  const paramsB = makeImmutable(params);
  return { ...jsl, params: { ...paramsA, ...paramsB } };
};

// Helper function aroung addOnlyJsl()
const addJsl = function (obj, params) {
  const { jsl } = obj;
  const jslA = addOnlyJsl(jsl, params);
  return { ...obj, jsl: jslA };
};

module.exports = {
  createJsl,
  addOnlyJsl,
  addJsl,
};
