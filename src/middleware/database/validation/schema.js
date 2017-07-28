'use strict';

const { memoize } = require('../../../utilities');

const { getRequired } = require('./required');

// Retrieves JSON schema to validate against
const getDataValidationSchema = memoize(({ idl, modelName, command, type }) => {
  const model = idl.models[modelName];
  const required = getRequired({ model, command, type });
  return { ...model, ...required };
});

module.exports = {
  getDataValidationSchema,
};
