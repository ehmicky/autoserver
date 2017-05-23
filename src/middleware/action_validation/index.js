'use strict';


const { isEqual } = require('lodash');

const { validate } = require('../../validation');
const { actions } = require('../../constants');
const { EngineError } = require('../../error');


/**
 * Action-related validation layer
 * Check Action input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the
 * right type
 **/
const actionValidation = function ({ idl: { models } = {} }) {
  return async function actionValidation(input) {
    const {
      modelName,
      args,
      sysArgs,
      action,
    } = input;

    const schema = getValidateServerSchema({ models });
    const data = {
      modelName,
      args,
      sysArgs,
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
  actionValidation,
};
