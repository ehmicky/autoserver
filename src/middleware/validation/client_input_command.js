'use strict';


const { validate } = require('../../validation');


/**
 * Validate API that input commandName is correct, e.g. allowed in IDL
 **/
const validateClientInputCommand = function ({
  idl,
  action,
  commandName,
  modelName,
}) {
  const type = 'clientInputCommand';
  const schema = getSchema({ idl, modelName });
  const reportInfo = { type, action, modelName };
  validate({ schema, data: commandName, reportInfo });
};

const getSchema = function ({ idl, modelName }) {
  const { commands } = idl.models[modelName];
  return {
    properties: {
      action: {
        enum: commands,
      },
    },
  };
};


module.exports = {
  validateClientInputCommand,
};
