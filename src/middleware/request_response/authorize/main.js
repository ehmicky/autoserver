'use strict';

const { evalAuthorize } = require('./eval');
const { addAuthorizeFilter } = require('./filter');
const { checkNewData } = require('./data');

// Handles `config.authorize` and `collection.authorize`
const validateAuthorization = function ({
  args,
  collname,
  clientCollname,
  config,
  config: { collections },
  serverParams,
  mInput,
  command,
  top,
  top: { command: { type: topCommand } },
}) {
  // `create`'s currentData query
  if (topCommand === 'create' && command === 'find') { return; }

  validateConfigAuth({ clientCollname, config, serverParams, mInput, top });

  const coll = collections[collname];
  const argsA = validateCollAuth({
    args,
    coll,
    collname,
    clientCollname,
    config,
    serverParams,
    mInput,
    command,
    top,
  });

  return { args: argsA };
};

// Handles `config.authorize`
const validateConfigAuth = function ({
  clientCollname,
  config,
  config: { authorize },
  serverParams,
  mInput,
  top,
}) {
  if (authorize === undefined) { return; }

  evalAuthorize({
    clientCollname,
    authorize,
    top,
    serverParams,
    config,
    mInput,
  });
};

// Handles `collection.authorize`
const validateCollAuth = function ({
  args,
  coll: { authorize },
  collname,
  clientCollname,
  config,
  serverParams,
  mInput,
  command,
  top,
}) {
  if (authorize === undefined) { return args; }

  const authorizeA = evalAuthorize({
    collname,
    clientCollname,
    authorize,
    top,
    serverParams,
    config,
    mInput,
  });
  if (authorizeA === true) { return args; }

  const argsA = addAuthorizeFilter({ command, authorize: authorizeA, args });

  checkNewData({ authorize: authorizeA, args, clientCollname, top });

  return argsA;
};

module.exports = {
  validateAuthorization,
};
