'use strict';

const { throwError } = require('../../error');

// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const responseValidation = function ({ response }) {
  if (!response) {
    const message = '\'response\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const { data, metadata } = response;
  validateData({ data });
  validateMetadata({ metadata });
};

const validateData = function ({ data }) {
  if (!data) {
    const message = '\'response.data\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!Array.isArray(data)) {
    const message = `'response.data' should be an array, not '${data}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateMetadata = function ({ metadata }) {
  if (!metadata) {
    const message = '\'response.metadata\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!Array.isArray(metadata)) {
    const message = `'response.metadata' should be an array, not '${metadata}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  responseValidation,
};
