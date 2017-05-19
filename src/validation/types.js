'use strict';


const { EngineError, EngineStartupError } = require('../error');


// Validation can be called from different places in the codebase
// Each come with its specific reason, error constructor and error message
const validationTypes = {
  idl: {
    reason: 'IDL_VALIDATION',
    type: EngineStartupError,
    message: 'Error in schema file',
  },
  options: {
    reason: 'OPTIONS_VALIDATION',
    type: EngineStartupError,
    message: 'Server options syntax error',
  },
  paginationInput: {
    reason: 'INPUT_VALIDATION',
    type: EngineError,
    message: 'Wrong parameters',
  },
  serverInputSyntax: {
    reason: 'INPUT_SERVER_VALIDATION',
    type: EngineError,
    message: 'Server-side input error',
  },
  clientInputSyntax: {
    reason: 'INPUT_VALIDATION',
    type: EngineError,
    message: 'Wrong parameters',
  },
  clientInputCommand: {
    reason: 'WRONG_COMMAND',
    type: EngineError,
    message: 'Command is not allowed',
  },
  clientInputSemantics: {
    reason: 'INPUT_VALIDATION',
    type: EngineError,
    message: 'Wrong parameters',
  },
  clientInputData: {
    reason: 'INPUT_VALIDATION',
    type: EngineError,
    message: 'Wrong parameters',
  },
  serverOutputSyntax: {
    reason: 'OUTPUT_VALIDATION',
    type: EngineError,
    message: 'Server-side output error',
  },
  serverOutputData: {
    reason: 'OUTPUT_VALIDATION',
    type: EngineError,
    message: 'Response is corrupted',
  },
  paginationOutput: {
    reason: 'OUTPUT_VALIDATION',
    type: EngineError,
    message: 'Response is corrupted',
  },
};


module.exports = {
  validationTypes,
};
