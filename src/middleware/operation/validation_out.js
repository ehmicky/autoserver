'use strict';

const { throwError } = require('../../error');
const { CONTENT_TYPES } = require('../../constants');

// Operation middleware output validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const operationValidationOut = function ({ response }) {
  if (!response || response.constructor !== Object) {
    const message = `'response' must be an object, not '${response}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const { content, type } = response;

  validateType({ type });
  validateContent({ content, type });
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
  const isRightContent = CONTENT_TYPES[type](content);

  if (!isRightContent) {
    const message = `Invalid 'content' of type '${type}': '${content}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  operationValidationOut,
};
