'use strict';

const { throwError } = require('../../error');

// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const responseValidation = function ({ response: { data, metadata } }) {
  if (!data) {
    const message = '\'response.data\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!Array.isArray(data)) {
    const message = `'response.data' should be an array, not '${data}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!metadata) {
    const message = '\'response.metadata\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  responseValidation,
};
