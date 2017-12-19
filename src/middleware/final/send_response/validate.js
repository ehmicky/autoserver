'use strict';

const { throwError } = require('../../../error');

const { TYPES } = require('./types');

const validateResponse = function ({ response: { type, content } }) {
  if (!type) {
    const message = 'Server sent an response with no content type';
    throwError(message, { reason: 'ENGINE' });
  }

  if (content === undefined) {
    const message = 'Server sent an empty response';
    throwError(message, { reason: 'ENGINE' });
  }

  if (TYPES[type] === undefined) {
    const message = 'Server tried to respond with an unsupported content type';
    throwError(message, { reason: 'ENGINE' });
  }
};

module.exports = {
  validateResponse,
};
