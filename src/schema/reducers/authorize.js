'use strict';

const {
  parseFilter,
  validateFilter,
  getAuthorizeAttrs,
} = require('../../filter');
const { mapColls } = require('../helpers');

// Parse `schema.authorize` and `coll.authorize` into AST
const normalizeAuthorize = function ({ schema, schema: { authorize } }) {
  if (authorize === undefined) { return schema; }

  const prefix = 'In \'schema.authorize\', ';
  const authorizeA = parseAuthorize({ authorize, schema, prefix });

  const schemaA = mapColls({ func: mapColl, schema });

  return { ...schemaA, authorize: authorizeA };
};

const mapColl = function ({ coll: { authorize }, collname, schema }) {
  if (authorize === undefined) { return; }

  const prefix = `In 'collection.${collname}.authorize', `;
  const authorizeA = parseAuthorize({ authorize, collname, schema, prefix });

  return { authorize: authorizeA };
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
    skipSchemaFuncs: true,
  });

  return authorizeA;
};

module.exports = {
  normalizeAuthorize,
};
