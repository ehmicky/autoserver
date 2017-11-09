'use strict';

const { pick, mapValues } = require('../utilities');
const { SYSTEM_VARS } = require('../schema_func');

// Retrieve type and names of all possible `model.authorize.*`
const getAuthorizeAttrs = function ({ schema, collname }) {
  const userVars = getUserVars({ schema });
  const modelAttrs = getModelAttrs({ schema, collname });
  return { ...userVars, ...modelAttrs, ...SYSTEM_VARS };
};

// `model.authorize.USER_VAR`
const getUserVars = function ({ schema: { variables = {} } }) {
  return mapValues(variables, () => ({ type: 'dynamic' }));
};

// `model.authorize['$model.ATTR']`
const getModelAttrs = function ({ schema: { collections }, collname }) {
  if (collname === undefined) { return; }

  const { attributes = {} } = collections[collname];
  const modelAttrs = mapValues(
    attributes,
    attr => pick(attr, ['type', 'isArray']),
  );
  return { $model: modelAttrs };
};

module.exports = {
  getAuthorizeAttrs,
};
