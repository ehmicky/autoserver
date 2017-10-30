'use strict';

const { pick, mapValues, mapKeys } = require('../utilities');
const { SYSTEM_VARS } = require('../schema_func');

// Retrieve type and names of all possible `model.authorize.*`
const getAuthorizeAttrs = function ({ schema, modelName }) {
  const userVars = getUserVars({ schema });
  const modelAttrs = getModelAttrs({ schema, modelName });
  return { ...userVars, ...modelAttrs, ...SYSTEM_VARS };
};

// `model.authorize.USER_VAR`
const getUserVars = function ({ schema: { variables = {} } }) {
  return mapValues(variables, () => ({ type: 'dynamic' }));
};

// `model.authorize['$model.ATTR']`
const getModelAttrs = function ({ schema: { models }, modelName }) {
  if (modelName === undefined) { return; }

  const { attributes = {} } = models[modelName];
  const modelAttrs = mapValues(
    attributes,
    attr => pick(attr, ['type', 'isArray']),
  );
  const modelAttrsA = mapKeys(
    modelAttrs,
    (attr, attrName) => `$model.${attrName}`,
  );
  return modelAttrsA;
};

module.exports = {
  getAuthorizeAttrs,
};
