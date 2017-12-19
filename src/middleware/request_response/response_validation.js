'use strict';

const { throwError } = require('../../errors');

// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const responseValidation = function ({ response: { data, metadata } }) {
  if (!data) {
    const message = '\'response.data\' should be defined';
    throwError(message, { reason: 'ENGINE' });
  }

  if (!Array.isArray(data)) {
    const message = `'response.data' should be an array, not '${data}'`;
    throwError(message, { reason: 'ENGINE' });
  }

  if (!metadata) {
    const message = '\'response.metadata\' should be defined';
    throwError(message, { reason: 'ENGINE' });
  }
};

module.exports = {
  responseValidation,
};
