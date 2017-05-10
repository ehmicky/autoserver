'use strict';


const { validate } = require('../../validation');
const { actions } = require('../../idl');


/**
 * API basic validation layer
 * Check API input, for the errors that should not happen, i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the right type
 **/
const basicValidation = async function ({ idl: { models } = {} }) {
  return async function basicValidation(input) {
    const { modelName, args, action } = input;

    const schema = getValidateServerSchema({ models });
    const data = { modelName, args, action };
    validate({ schema, data, reportInfo: { type: 'serverInputSyntax' } });

    const response = await this.next(input);
    return response;
  };
};

// Get JSON schema to validate against input
const getValidateServerSchema = function ({ models = {} }) {
  const modelNames = Object.keys(models);

  return {
    required: ['action', 'args', 'modelName'],
    properties: {
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: { type: 'object' },
      action: {
        type: 'string',
        enum: actionsNames,
      },
    },
  };
};
const actionsNames = actions.map(({ name }) => name);


module.exports = {
  basicValidation,
};
