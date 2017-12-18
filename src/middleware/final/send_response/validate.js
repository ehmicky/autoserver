'use strict';

const { throwError } = require('../../../error');

const { types } = require('./types');

const validateResponse = function ({ response: { type, content } }) {
  if (!type) {
    throwError('Server sent an response with no content type', {
      reason: 'ENGINE',
    });
  }

  if (content === undefined) {
    throwError('Server sent an empty response', {
      reason: 'ENGINE',
    });
  }

  if (!types[type]) {
    const message = 'Server tried to respond with an unsupported content type';
    throwError(message, { reason: 'ENGINE' });
  }
};

module.exports = {
  validateResponse,
};
