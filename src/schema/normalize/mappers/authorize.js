'use strict';

const {
  parseFilter,
  validateFilter,
  getAuthorizeAttrs,
} = require('../../../database');

// Parse `model.authorize` into AST
const normalizeAuthorize = function (model, { modelName, schema }) {
  const { authorize } = model;
  if (authorize === undefined) { return model; }

  const authorizeA = parseAuthorize({ authorize, modelName, schema });

  if (authorizeA === undefined) { return model; }

  return { ...model, authorize: authorizeA };
};

const parseAuthorize = function ({ authorize, modelName, schema }) {
  const prefix = `In 'model.${modelName}.authorize', `;
  const reason = 'SCHEMA_VALIDATION';
  const authorizeA = parseFilter({ filter: authorize, prefix, reason });

  const attrs = getAuthorizeAttrs({ schema, modelName });
  validateFilter({
    filter: authorizeA,
    prefix,
    reason,
    attrs,
    skipInlineFuncs: true,
  });

  return authorizeA;
};

module.exports = {
  normalizeAuthorize,
};
