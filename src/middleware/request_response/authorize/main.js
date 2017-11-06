'use strict';

const { evalAuthorize } = require('./eval');
const { addAuthorizeFilter } = require('./filter');
const { checkNewData } = require('./data');

// Handles `schema.authorize` and `model.authorize`
const validateAuthorization = function ({
  args,
  modelname,
  schema,
  schema: { models },
  userVars,
  mInput,
  command,
  top,
  top: { command: { type: topCommand } },
}) {
  // `create`'s currentData query
  if (topCommand === 'create' && command === 'find') { return; }

  validateSchemaAuth({ schema, userVars, mInput, top });

  const model = models[modelname];
  const argsA = validateModelAuth({
    args,
    model,
    modelname,
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
  modelname,
  schema,
  userVars,
  mInput,
  command,
  top,
}) {
  if (authorize === undefined) { return args; }

  const authorizeA = evalAuthorize({
    modelname,
    authorize,
    top,
    userVars,
    schema,
    mInput,
  });
  if (authorizeA === true) { return args; }

  const argsA = addAuthorizeFilter({ command, authorize: authorizeA, args });

  checkNewData({ authorize: authorizeA, args, modelname, top });

  return argsA;
};

module.exports = {
  validateAuthorization,
};
