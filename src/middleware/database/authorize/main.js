'use strict';

const { handleSchemaFuncs } = require('./schema_func');
const { addAuthorizeFilter } = require('./filter');

// Handles `model.authorize`
const validateAuthorization = function ({
  args,
  args: { filter },
  modelName,
  schema: { models },
  userVars,
  mInput,
}) {
  const { authorize } = models[modelName];
  if (authorize === undefined) { return; }

  const { authorize: authorizeA, vars } = handleSchemaFuncs({
    authorize,
    userVars,
    mInput,
  });

  const filterA = addAuthorizeFilter({
    modelName,
    authorize: authorizeA,
    vars,
    filter,
  });
  // Keep current `args.filter` as `args.preAuthorizeFilter`
  const argsA = { ...args, filter: filterA, preAuthorizeFilter: filter };

  return { args: argsA };
};

module.exports = {
  validateAuthorization,
};
