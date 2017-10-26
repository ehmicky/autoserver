'use strict';

const { recurseMap } = require('../../../utilities');
const { runSchemaFunc, getVars } = require('../../../schema_func');

const { getUserVars } = require('./user_vars');

// Handle all schema function related logic in `model.authorize`
const handleSchemaFuncs = function ({ authorize, userVars, mInput }) {
  const authorizeA = resolveSchemaFuncs({ authorize, mInput });

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

const getAllVars = function ({ authorize, userVars, mInput }) {
  const userVarsA = getUserVars({ authorize, userVars, mInput });
  const systemVars = getVars(mInput);

  return { ...userVarsA, ...systemVars };
};

module.exports = {
  handleSchemaFuncs,
};
