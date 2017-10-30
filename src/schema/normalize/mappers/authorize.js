'use strict';

const {
  parseFilter,
  validateFilter,
  getAuthorizeAttrs,
} = require('../../../filter');

// Parse `schema.authorize` into AST
const normalizeSchemaAuthorize = function ({ schema, schema: { authorize } }) {
  if (authorize === undefined) { return schema; }

  const prefix = 'In \'schema.authorize\', ';
  const authorizeA = parseAuthorize({ authorize, schema, prefix });

  return { ...schema, authorize: authorizeA };
};

// Parse `model.authorize` into AST
const normalizeAuthorize = function (model, { modelName, schema }) {
  const { authorize } = model;
  if (authorize === undefined) { return model; }

  const prefix = `In 'model.${modelName}.authorize', `;
  const authorizeA = parseAuthorize({ authorize, modelName, schema, prefix });

  return { ...model, authorize: authorizeA };
};

const parseAuthorize = function ({ authorize, modelName, schema, prefix }) {
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
  normalizeSchemaAuthorize,
  normalizeAuthorize,
};
