'use strict';


const { validate } = require('../../validation');


/**
 * Validate API that input dbCallFull is correct, e.g. allowed in IDL
 **/
const validateClientInputDbCall = function ({
  idl,
  action,
  dbCallFull,
  modelName,
}) {
  const type = 'clientInputDbCall';
  const schema = getSchema({ idl, modelName });
  const reportInfo = { type, action, modelName };
  validate({ schema, data: dbCallFull, reportInfo });
};

const getSchema = function ({ idl, modelName }) {
  const { calls } = idl.models[modelName];
  return {
    properties: {
      action: {
        enum: calls,
      },
    },
  };
};


module.exports = {
  validateClientInputDbCall,
};
