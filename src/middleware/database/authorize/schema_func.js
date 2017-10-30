'use strict';

const { recurseMap } = require('../../../utilities');
const { runSchemaFunc, getVars } = require('../../../schema_func');
const { validateFilter, getAuthorizeAttrs } = require('../../../filter');

const { getUserVars } = require('./user_vars');

// Handle all schema function related logic in `model.authorize`
const handleSchemaFuncs = function ({
  modelName,
  authorize,
  userVars,
  schema,
  mInput,
}) {
  const authorizeA = resolveSchemaFuncs({ authorize, mInput });

  validateAuthorize({ modelName, authorize: authorizeA, schema });

  const vars = getAllVars({ authorize: authorizeA, userVars, mInput });

  return { authorize: authorizeA, vars };
};

// Resolve all schema functions in `model.authorize` so all leaves values
// are constants
const resolveSchemaFuncs = function ({ authorize, mInput }) {
  return recurseMap(
    authorize,
    schemaFunc => runSchemaFunc({ schemaFunc, mInput }),
  );
};

// Most `model.authorize` validation is done compile-time
// But schema functions are evaluated runtime. Their validation is skipped
// compile-time, and they are validated here once evaluated.
const validateAuthorize = function ({ modelName, authorize, schema }) {
  const prefix = modelName === undefined
    ? 'In \'schema.authorize\', '
    : `In 'model.${modelName}.authorize', `;
  const reason = 'SCHEMA_VALIDATION';

  const attrs = getAuthorizeAttrs({ schema, modelName });
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
