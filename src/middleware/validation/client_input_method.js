'use strict';


const { validate } = require('../../utilities');


/**
 * Validate API that input method is correct, e.g. allowed in IDL
 **/
const validateClientInputMethod = function ({ idl, modelName, operation }) {
  const type = 'clientInputMethod';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: operation, reportInfo: { type, operation, modelName } });
};

const getSchema = function ({ idl, modelName }) {
  const operations = idl.models[modelName].operations;
  return {
    properties: {
      operation: {
        enum: operations,
      },
    },
  };
};


module.exports = {
  validateClientInputMethod,
};
