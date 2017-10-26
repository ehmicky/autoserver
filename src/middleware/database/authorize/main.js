'use strict';

const { handleSchemaFuncs } = require('./schema_func');
const { evalAuthorize } = require('./eval');
const { addAuthorizeFilter } = require('./filter');

// Handles `model.authorize`
const validateAuthorization = function ({
  args,
  modelName,
  schema: { models },
  userVars,
  mInput,
  command,
}) {
  const { authorize } = models[modelName];
  if (authorize === undefined) { return; }

  const { authorize: authorizeA, vars } = handleSchemaFuncs({
    authorize,
    userVars,
    mInput,
  });

  const authorizeB = evalAuthorize({ modelName, authorize: authorizeA, vars });
  if (authorizeB === true) { return; }

  const argsA = addAuthorizeFilter({ command, authorize: authorizeB, args });

  return { args: argsA };
};

module.exports = {
  validateAuthorization,
};
