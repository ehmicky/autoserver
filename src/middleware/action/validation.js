'use strict';

const { isEqual } = require('lodash');

const { ACTIONS } = require('../../constants');
const { throwError } = require('../../error');

// Action-related validation middleware
// Check Action mInput, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: `action`, `args`, `modelName` should be defined and of the
// right type
const actionValidation = function ({
  action,
  fullAction,
  modelName,
  idl: { models },
}) {
  validateAction({ action });
  validateFullAction({ fullAction });
  const modelNames = Object.keys(models);
  validateModelName({ modelName, modelNames });
};

// Validate that action is among the possible ones
const validateAction = function ({ action }) {
  const isValid = ACTIONS.some(possibleAction =>
    isEqual(possibleAction, action)
  );

  if (!isValid) {
    const message = `Invalid 'action': '${JSON.stringify(action)}'`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

const validateFullAction = function ({ fullAction }) {
  if (typeof fullAction !== 'string') {
    const message = `Invalid 'fullAction': '${JSON.stringify(fullAction)}'`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

const validateModelName = function ({ modelName, modelNames }) {
  if (!modelName || !modelNames.includes(modelName)) {
    const message = `Invalid 'modelName': '${modelName}' must be one of: ${modelNames.join(', ')}`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

module.exports = {
  actionValidation,
};
