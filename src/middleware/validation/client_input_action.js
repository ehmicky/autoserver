'use strict';


const { validate } = require('../../utilities');


/**
 * Validate API that input action is correct, e.g. allowed in IDL
 **/
const validateClientInputAction = function ({ idl, modelName, action }) {
  const type = 'clientInputAction';
  const schema = getSchema({ idl, modelName });
  validate({ schema, data: action, reportInfo: { type, action, modelName } });
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
