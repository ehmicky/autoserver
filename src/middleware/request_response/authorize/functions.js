'use strict';

const { runSchemaFunc, getVars } = require('../../../functions');
const {
  validateFilter,
  getAuthorizeAttrs,
  mapNodes,
} = require('../../../filter');

const { getServerVars } = require('./server_vars');

// Handle all schema function related logic in `coll.authorize`
const handleSchemaFuncs = function ({
  collname,
  authorize,
  serverVars,
  schema,
  mInput,
}) {
  const authorizeA = resolveSchemaFuncs({ authorize, mInput });

  validateAuthorize({ collname, authorize: authorizeA, schema });

  const vars = getAllVars({ authorize: authorizeA, serverVars, mInput });

  return { authorize: authorizeA, vars };
};

// Resolve all schema functions in `coll.authorize` so all leaves values
// are constants
const resolveSchemaFuncs = function ({ authorize, mInput }) {
  return mapNodes(
    authorize,
    node => resolveSchemaFunc({ mInput, node }),
  );
};

const resolveSchemaFunc = function ({ mInput, node: { value, ...node } }) {
  const valueA = runSchemaFunc({ schemaFunc: value, mInput });
  return { ...node, value: valueA };
};

// Most `coll.authorize` validation is done startup time
// But schema functions are evaluated runtime. Their validation is skipped
// startup time, and they are validated here once evaluated.
const validateAuthorize = function ({ collname, authorize, schema }) {
  const prefix = collname === undefined
    ? 'In \'schema.authorize\', '
    : `In 'collection.${collname}.authorize', `;
  const reason = 'SCHEMA_VALIDATION';

  const attrs = getAuthorizeAttrs({ schema, collname });
  validateFilter({ filter: authorize, prefix, reason, attrs });
};

const getAllVars = function ({ authorize, serverVars, mInput }) {
  const serverVarsA = getServerVars({ authorize, serverVars, mInput });
  const systemVars = getVars(mInput);

  return { ...serverVarsA, ...systemVars };
};

module.exports = {
  handleSchemaFuncs,
};
