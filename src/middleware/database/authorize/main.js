'use strict';

const { evalAuthorize } = require('./eval');
const { addAuthorizeFilter } = require('./filter');
const { checkNewData } = require('./data');

// Handles `schema.authorize` and `model.authorize`
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
  validateSchemaAuth({ schema, userVars, mInput, top });

  const model = models[modelName];
  const argsA = validateModelAuth({
    args,
    model,
    modelName,
    schema,
    userVars,
    mInput,
    command,
    top,
  });

  return { args: argsA };
};

// Handles `schema.authorize`
const validateSchemaAuth = function ({
  schema,
  schema: { authorize },
  userVars,
  mInput,
  top,
}) {
  if (authorize === undefined) { return; }

  evalAuthorize({ authorize, top, userVars, schema, mInput });
};

// Handles `model.authorize`
const validateModelAuth = function ({
  args,
  model: { authorize },
  modelName,
  schema,
  userVars,
  mInput,
  command,
  top,
}) {
  if (authorize === undefined) { return args; }

  const authorizeA = evalAuthorize({
    modelName,
    authorize,
    top,
    userVars,
    schema,
    mInput,
  });
  if (authorizeA === true) { return args; }

  const argsA = addAuthorizeFilter({ command, authorize: authorizeA, args });

  checkNewData({ authorize: authorizeA, args, modelName, top });

  return argsA;
};

module.exports = {
  validateAuthorization,
};
