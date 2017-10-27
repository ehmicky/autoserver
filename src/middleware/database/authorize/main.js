'use strict';

const { evalAuthorize } = require('./eval');
const { addAuthorizeFilter } = require('./filter');
const { checkNewData } = require('./data');

// Handles `model.authorize`
const validateAuthorization = function ({
  args,
  modelName,
  schema,
  schema: { models },
  userVars,
  mInput,
  command,
  top,
}) {
  const { authorize } = models[modelName];
  if (authorize === undefined) { return; }

  const authorizeA = evalAuthorize({
    modelName,
    authorize,
    top,
    userVars,
    schema,
    mInput,
  });
  if (authorizeA === true) { return; }

  const argsA = addAuthorizeFilter({ command, authorize: authorizeA, args });

  checkNewData({ authorize: authorizeA, args, modelName, top });

  return { args: argsA };
};

module.exports = {
  validateAuthorization,
};
