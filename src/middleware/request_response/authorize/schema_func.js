'use strict';

const { runSchemaFunc, getVars } = require('../../../schema_func');
const {
  validateFilter,
  getAuthorizeAttrs,
  mapNodes,
} = require('../../../filter');

const { getUserVars } = require('./user_vars');

// Handle all schema function related logic in `model.authorize`
const handleSchemaFuncs = function ({
  collname,
  authorize,
  userVars,
  schema,
  mInput,
}) {
  const authorizeA = resolveSchemaFuncs({ authorize, mInput });

  validateAuthorize({ collname, authorize: authorizeA, schema });

  const vars = getAllVars({ authorize: authorizeA, userVars, mInput });

  return { authorize: authorizeA, vars };
};

// Resolve all schema functions in `model.authorize` so all leaves values
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

// Most `model.authorize` validation is done compile-time
// But schema functions are evaluated runtime. Their validation is skipped
// compile-time, and they are validated here once evaluated.
const validateAuthorize = function ({ collname, authorize, schema }) {
  const prefix = collname === undefined
    ? 'In \'schema.authorize\', '
    : `In 'collection.${collname}.authorize', `;
  const reason = 'SCHEMA_VALIDATION';

  const attrs = getAuthorizeAttrs({ schema, collname });
  validateFilter({ filter: authorize, prefix, reason, attrs });
};

const getAllVars = function ({ authorize, userVars, mInput }) {
  const userVarsA = getUserVars({ authorize, userVars, mInput });
  const systemVars = getVars(mInput);

  return { ...userVarsA, ...systemVars };
};

module.exports = {
  handleSchemaFuncs,
};
