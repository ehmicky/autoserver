'use strict';

const { COMMANDS } = require('../../constants');
const { throwError } = require('../../error');

// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const responseValidation = function ({ command, response }) {
  const { multiple } = COMMANDS.find(({ name }) => name === command.name);

  if (!response) {
    const message = '\'response\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const { data, metadata } = response;
  validateData({ data, multiple });
  validateMetadata({ metadata, multiple });
};

const validateData = function ({ data, multiple }) {
  if (!data) {
    const message = '\'response.data\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (multiple && !Array.isArray(data)) {
    const message = `'response.data' should be an array, not '${data}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!multiple && data.constructor !== Object) {
    const message = `'response.data' should be an object, not '${data}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

const validateMetadata = function ({ metadata, multiple }) {
  if (!metadata) {
    const message = '\'response.metadata\' should be defined';
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (multiple && !Array.isArray(metadata)) {
    const message = `'response.metadata' should be an array, not '${metadata}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (!multiple && metadata.constructor !== Object) {
    const message = `'response.metadata' should be an object, not '${metadata}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
};

module.exports = {
  responseValidation,
};
