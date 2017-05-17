'use strict';


const { isEqual } = require('lodash');

const { validate } = require('../../validation');
const { actions } = require('../../constants');
const { EngineError } = require('../../error');


/**
 * API basic validation layer
 * Check API input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the
 * right type
 **/
const basicValidation = async function ({ idl: { models } = {} }) {
  return async function basicValidation(input) {
    const {
      modelName,
      args,
      sysArgs,
      params,
      info,
      action,
    } = input;

    const schema = getValidateServerSchema({ models });
    const data = {
      modelName,
      args,
      sysArgs,
      params,
      info,
      action,
    };
    const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };
    validate({ schema, data, reportInfo });

    validateAction({ action });

    const response = await this.next(input);
    return response;
  };
};

// Get JSON schema to validate against input
const getValidateServerSchema = function ({ models = {} }) {
  const modelNames = Object.keys(models);

  return {
    required: [
      'modelName',
      'args',
      'sysArgs',
      'params',
      'info',
      'action',
    ],
    properties: {
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: { type: 'object' },
      sysArgs: { type: 'object' },
      params: { type: 'object' },
      info: { type: 'object' },
      action: { type: 'object' },
    },
  };
};

// Validate that action is among the possible ones
const validateAction = function ({ action }) {
  const isValid = actions.some(possibleAction => {
    return isEqual(possibleAction, action);
  });
  if (!isValid) {
    const message = `Invalid action: ${JSON.stringify(action)}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};


module.exports = {
  basicValidation,
};
