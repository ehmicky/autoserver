'use strict';


const { isEqual } = require('lodash');

const { ACTIONS } = require('../../constants');
const { EngineError } = require('../../error');


/**
 * Action-related validation layer
 * Check Action input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 * In short: `action`, `args`, `modelName` should be defined and of the
 * right type
 **/
const actionValidation = function ({ idl: { models } }) {
  return async function actionValidation(input) {
    const { action, fullAction, modelName, log } = input;
    const perf = log.perf.start('action.validation', 'middleware');

    validateAction({ action });
    validateFullAction({ fullAction });
    const modelNames = Object.keys(models);
    validateModelName({ modelName, modelNames });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Validate that action is among the possible ones
const validateAction = function ({ action }) {
  const isValid = ACTIONS.some(possibleAction => {
    return isEqual(possibleAction, action);
  });
  if (!isValid) {
    const message = `Invalid 'action': '${JSON.stringify(action)}'`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

const validateFullAction = function ({ fullAction }) {
  if (typeof fullAction !== 'string') {
    const message = `Invalid 'fullAction': '${JSON.stringify(fullAction)}'`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

const validateModelName = function ({ modelName, modelNames }) {
  if (!modelName || !modelNames.includes(modelName)) {
    const message = `Invalid 'modelName': '${modelName}' must be one of: ${modelNames.join(', ')}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};


module.exports = {
  actionValidation,
};
