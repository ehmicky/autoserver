'use strict';

const { pick, mapValues } = require('../utilities');
const { SYSTEM_VARS } = require('../functions');

// Retrieve type and names of all possible `coll.authorize.*`
const getAuthorizeAttrs = function ({ config, collname }) {
  const serverVars = getServerVars({ config });
  const modelAttrs = getModelAttrs({ config, collname });
  return { ...serverVars, ...modelAttrs, ...SYSTEM_VARS };
};

// `coll.authorize.SERVER_VAR`
const getServerVars = function ({ config: { variables = {} } }) {
  return mapValues(variables, () => ({ type: 'dynamic' }));
};

// `coll.authorize['model.ATTR']`
const getModelAttrs = function ({ config: { collections }, collname }) {
  if (collname === undefined) { return; }

  const { attributes = {} } = collections[collname];
  const modelAttrs = mapValues(
    attributes,
    attr => pick(attr, ['type', 'isArray']),
  );
  return { model: modelAttrs };
};

module.exports = {
  getAuthorizeAttrs,
};
