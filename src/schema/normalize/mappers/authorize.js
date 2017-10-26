'use strict';

const { pick, mapValues, mapKeys } = require('../../../utilities');
const { parseFilter } = require('../../../database');
const { SYSTEM_VARS } = require('../../../schema_func');

// Parse `model.authorize` into AST
const normalizeAuthorize = function (model, { modelName, schema }) {
  if (model.authorize === undefined) { return model; }

  const authorize = parseAuthorize({ model, modelName, schema });
  return { ...model, authorize };
};

const parseAuthorize = function ({
  model: { authorize, attributes },
  modelName,
  schema,
}) {
  const attrs = getAttrs({ attributes, schema });
  const prefix = `In 'model.${modelName}.authorize', `;
  const authorizeA = parseFilter({ filter: authorize, attrs, prefix });
  return authorizeA;
};

// Retrieve type and names of all possible `model.authorize.*`
const getAttrs = function ({ attributes, schema }) {
  const userVars = getUserVars({ schema });
  const modelAttrs = getModelAttrs({ attributes });
  const attrs = { ...userVars, ...modelAttrs, ...SYSTEM_VARS };

  // Can use schema functions inside `model.authorize`
  const attrsA = mapValues(
    attrs,
    attr => ({ ...attr, allowInlineFuncs: true }),
  );

  return attrsA;
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
  normalizeAuthorize,
};
