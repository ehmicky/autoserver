'use strict';


const { validate } = require('../../validation');


/**
 * Validate API that input dbCallFull is correct, e.g. allowed in IDL
 **/
const validateClientInputAction = function ({
  idl,
  action,
  dbCallFull,
  modelName,
}) {
  const type = 'clientInputAction';
  const schema = getSchema({ idl, modelName });
  const reportInfo = { type, action, modelName };
  validate({ schema, data: dbCallFull, reportInfo });
};

const getSchema = function ({ idl, modelName }) {
  const actions = idl.models[modelName].actions;
  return {
    properties: {
      action: {
        enum: actions,
      },
    },
  };
};


module.exports = {
  validateClientInputAction,
};
