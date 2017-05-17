'use strict';


const { validate } = require('../../validation');


/**
 * Validate API that input command.name is correct, e.g. allowed in IDL
 **/
const validateClientInputCommand = function ({
  idl,
  action,
  command,
  modelName,
}) {
  const type = 'clientInputCommand';
  const schema = getSchema({ idl, modelName });
  const reportInfo = { type, action, modelName };
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
