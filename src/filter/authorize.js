'use strict';

const { pick, mapValues } = require('../utilities');
const { SYSTEM_PARAMS } = require('../functions');

// Retrieve type and names of all possible `coll.authorize.*`
const getAuthorizeAttrs = function ({ config, collname }) {
  const serverParams = getServerParams({ config });
  const modelAttrs = getModelAttrs({ config, collname });
  return { ...serverParams, ...modelAttrs, ...SYSTEM_PARAMS };
};

// `coll.authorize.SERVERPARAM`
const getServerParams = function ({ config: { params = {} } }) {
  return mapValues(params, () => ({ type: 'dynamic' }));
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
