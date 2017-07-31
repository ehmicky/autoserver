'use strict';

const { memoize } = require('../../../utilities');

const { getRequired } = require('./required');

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({ idl, modelName, command, type }) {
  const model = idl.models[modelName];
  const required = getRequired({ model, command, type });
  return { ...model, ...required };
};

const mGetDataValidationSchema = memoize(getDataValidationSchema);

module.exports = {
  getDataValidationSchema: mGetDataValidationSchema,
};
