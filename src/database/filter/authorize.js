'use strict';

const { pick, mapValues, mapKeys } = require('../../utilities');
const { SYSTEM_VARS } = require('../../schema_func');

// Retrieve type and names of all possible `model.authorize.*`
const getAuthorizeAttrs = function ({ schema, schema: { models }, modelName }) {
  const userVars = getUserVars({ schema });
  const { attributes } = models[modelName];
  const modelAttrs = getModelAttrs({ attributes });
  return { ...userVars, ...modelAttrs, ...SYSTEM_VARS };
};

// `model.authorize.USER_VAR`
const getUserVars = function ({ schema: { variables = {} } }) {
  return mapValues(variables, () => ({ type: 'dynamic' }));
};

// `model.authorize['$model.ATTR']`
const getModelAttrs = function ({ attributes = {} }) {
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
