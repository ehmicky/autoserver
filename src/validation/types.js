'use strict';

// Validation can be called from different places in the codebase
// Each come with its specific reason and error message
const validationTypes = {
  idl: {
    reason: 'IDL_VALIDATION',
    message: 'Error in schema file',
  },
  clientInputData: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
};

module.exports = {
  validationTypes,
};
