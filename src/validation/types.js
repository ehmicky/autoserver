'use strict';


const { EngineError, EngineStartupError } = require('../error');


// Validation can be called from different places in the codebase
// Each come with its specific reason, error constructor and error message
const validationTypes = {
  idl: {
    reason: 'IDL_VALIDATION',
    ErrorType: EngineStartupError,
    messageProcessor: ({ message }) => `In schema file: ${message}`,
  },
  options: {
    reason: 'OPTIONS_VALIDATION',
    ErrorType: EngineStartupError,
    messageProcessor: ({ message }) => `Server options syntax error: ${message}`,
  },
  paginationInput: {
    reason: 'INPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', wrong parameters: ${message}`,
  },
  serverInputSyntax: {
    reason: 'INPUT_SERVER_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message }) => `Server-side input error: ${message}`,
  },
  clientInputSyntax: {
    reason: 'INPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', wrong parameters: ${message}`,
  },
  clientInputCommand: {
    reason: 'WRONG_COMMAND',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', wrong command: ${message}`,
  },
  clientInputSemantics: {
    reason: 'INPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', wrong parameters: ${message}`,
  },
  clientInputData: {
    reason: 'INPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', wrong parameters: ${message}`,
  },
  serverOutputSyntax: {
    reason: 'OUTPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message }) => `Server-side output error: ${message}`,
  },
  serverOutputData: {
    reason: 'OUTPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', response is corrupted: ${message}`,
  },
  paginationOutput: {
    reason: 'OUTPUT_VALIDATION',
    ErrorType: EngineError,
    messageProcessor: ({ message, reportInfo: { action, modelName } }) =>
      `In action '${action.name}', model '${modelName}', response is corrupted: ${message}`,
  },
};


module.exports = {
  validationTypes,
};
