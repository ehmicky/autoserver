'use strict';


const { COMMANDS } = require('../../../constants');
const { EngineError } = require('../../../error');


// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
const validateResponse = function ({ command, response }) {
  const { multiple } = COMMANDS.find(({ name }) => name === command.name);

  if (!response) {
    const message = '\'response\' should be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
  const { data, metadata } = response;
  if (!data) {
    const message = '\'response.data\' should be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
  if (!metadata) {
    const message = '\'response.metadata\' should be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (multiple && !(data instanceof Array)) {
    const message = `'response.data' should be an array, not '${data}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
  if (!multiple && data.constructor !== Object) {
    const message = `'response.data' should be an object, not '${data}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  if (multiple && !(metadata instanceof Array)) {
    const message = `'response.metadata' should be an array, not '${metadata}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }
  if (!multiple && metadata.constructor !== Object) {
    const message = `'response.metadata' should be an object, not '${metadata}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

};


module.exports = {
  validateResponse,
};
