'use strict';


const { validate } = require('../../validation');


/**
 * Validate that input command.name is correct, e.g. allowed in IDL
 **/
const validateClientInputCommand = function ({
  idl,
  command,
  modelName,
  sysArgs: { authorization },
}) {
  // If sysArgs.authorization is false, bypass this check because this
  // is an intermediary command which should always succeed
  if (!authorization) { return; }

  const type = 'clientInputCommand';
  const schema = getSchema({ idl, modelName });
  const reportInfo = { type };
  validate({ schema, data: command.name, reportInfo });
};

const getSchema = function ({ idl, modelName }) {
  const { commands } = idl.models[modelName];
  return {
    enum: commands,
  };
};


module.exports = {
  validateClientInputCommand,
};
