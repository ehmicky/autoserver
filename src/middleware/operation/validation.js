'use strict';

const { EngineError } = require('../../error');
const { ACTIONS, CONTENT_TYPES } = require('../../constants');

// Operation middleware validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const operationValidation = async function (nextFunc, input) {
  const { operation, route } = input;

  if (!operation) {
    const message = `Unsupported operation: ${route}`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_OPERATION' });
  }

  const response = await nextFunc(input);

  validateResponse({ response });

  return response;
};

const validateResponse = function ({ response }) {
  if (!response || response.constructor !== Object) {
    const message = `'response' must be an object, not '${response}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const { content, type, actions } = response;

  validateType({ type });
  validateContent({ content, type });
  validateActions({ actions });
};

const validateType = function ({ type }) {
  if (typeof type !== 'string') {
    const message = `'type' must be a string, not '${type}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const isWrongType = !CONTENT_TYPES[type];

  if (isWrongType) {
    const message = `Invalid 'type': '${type}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateContent = function ({ content, type }) {
  const isWrongContent = !CONTENT_TYPES[type]({ content });

  if (isWrongContent) {
    const message = `Invalid 'content': '${content}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateActions = function ({ actions }) {
  if (actions === undefined) { return; }

  if (!Array.isArray(actions)) {
    const message = `'actions' must be an array, not '${actions}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const wrongAction = actions.find(({ name }) =>
    !ACTIONS.some(({ name: actionName }) => name === actionName)
  );

  if (wrongAction) {
    const message = `'actions' contains invalid action: '${JSON.stringify(wrongAction)}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  operationValidation,
};
