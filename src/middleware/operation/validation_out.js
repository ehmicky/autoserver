'use strict';

const { throwError } = require('../../error');
const { ACTIONS, CONTENT_TYPES } = require('../../constants');

// Operation middleware output validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const operationValidationOut = function ({ response }) {
  if (!response || response.constructor !== Object) {
    const message = `'response' must be an object, not '${response}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const { content, type, actions } = response;

  validateType({ type });
  validateContent({ content, type });
  validateActions({ actions });
};

const validateType = function ({ type }) {
  if (typeof type !== 'string') {
    const message = `'type' must be a string, not '${type}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const isWrongType = !CONTENT_TYPES[type];

  if (isWrongType) {
    const message = `Invalid 'type': '${type}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateContent = function ({ content, type }) {
  const isWrongContent = !CONTENT_TYPES[type]({ content });

  if (isWrongContent) {
    const message = `Invalid 'content': '${content}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateActions = function ({ actions }) {
  if (actions === undefined) { return; }

  if (!Array.isArray(actions)) {
    const message = `'actions' must be an array, not '${actions}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const wrongAction = actions.find(action => isWrongAction({ action }));

  if (wrongAction) {
    const message = `'actions' contains invalid action: '${JSON.stringify(wrongAction)}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const isWrongAction = function ({ action }) {
  return !ACTIONS.some(({ name: actionName }) => action.name === actionName);
};

module.exports = {
  operationValidationOut,
};
