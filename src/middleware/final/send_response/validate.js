'use strict';

const { throwError } = require('../../../error');

const { types } = require('./types');

const validateResponse = function ({ response: { type, content } }) {
  if (!type) {
    throwError('Server sent an response with no content type', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }

  if (content === undefined) {
    throwError('Server sent an empty response', {
      reason: 'SERVER_INPUT_VALIDATION',
    });
  }

  if (!types[type]) {
    const message = 'Server tried to respond with an unsupported content type';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  validateResponse,
};
