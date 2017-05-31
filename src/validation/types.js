'use strict';


// Validation can be called from different places in the codebase
// Each come with its specific reason and error message
const validationTypes = {
  idl: {
    reason: 'IDL_VALIDATION',
    message: 'Error in schema file',
  },
  options: {
    reason: 'OPTIONS_VALIDATION',
    message: 'Server options syntax error',
  },
  paginationInput: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  serverInputSyntax: {
    reason: 'INPUT_SERVER_VALIDATION',
    message: 'Server-side input error',
  },
  clientInputSyntax: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  clientInputCommand: {
    reason: 'WRONG_COMMAND',
    message: 'Command is not allowed',
  },
  clientInputSemantics: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  clientInputData: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  serverOutputSyntax: {
    reason: 'OUTPUT_VALIDATION',
    message: 'Server-side output error',
  },
  serverOutputData: {
    reason: 'OUTPUT_VALIDATION',
    message: 'Response is corrupted',
  },
  paginationOutput: {
    reason: 'OUTPUT_VALIDATION',
    message: 'Response is corrupted',
  },
};


module.exports = {
  validationTypes,
};
