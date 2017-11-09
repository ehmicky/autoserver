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

// Parse `coll.authorize` into AST
const normalizeAuthorize = function (coll, { collname, schema }) {
  const { authorize } = coll;
  if (authorize === undefined) { return coll; }

  const prefix = `In 'collection.${collname}.authorize', `;
  const authorizeA = parseAuthorize({ authorize, collname, schema, prefix });

  return { ...coll, authorize: authorizeA };
};

const parseAuthorize = function ({ authorize, collname, schema, prefix }) {
  const reason = 'SCHEMA_VALIDATION';
  const authorizeA = parseFilter({ filter: authorize, prefix, reason });

  const attrs = getAuthorizeAttrs({ schema, collname });
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
