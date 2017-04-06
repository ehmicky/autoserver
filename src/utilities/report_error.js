'use strict';


const { EngineError } = require('../error');


// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, type }) {
  // Retrieve error message as string, from error objects
  const errorsText = '\n' + errors
    .map(error => {
      let inputPath;
      // Prepends argument name, e.g. `filters.attr` instead of `attr`
      if (error.argName) {
        inputPath = error.argName + error.dataPath;
      } else {
        inputPath = error.dataPath.substr(1);
      }

      // Get (potentially custom) error message
      const message = getErrorMessage({ error });
      // Prepends argument name to error message
      const errorText = `${inputPath} ${message}`;
      return errorText;
    })
    .join('\n');
  throw new EngineError(errorsText, { reason: reasons[type] });
};
const reasons = {
  idl: 'CONFIGURATION_INVALID',
  serverInputSyntax: 'INPUT_SERVER_VALIDATION',
  clientInputSyntax: 'INPUT_VALIDATION',
  clientInputSemantics: 'INPUT_VALIDATION',
  clientInputData: 'INPUT_VALIDATION',
  serverOutputSyntax: 'OUTPUT_VALIDATION',
  serverOutputData: 'OUTPUT_VALIDATION',
};

// Customize error messages when the library's ones are unclear
const getErrorMessage = function({ error }) {
  const customErrorMessage = errorMessages[error.keyword];
  return customErrorMessage ? customErrorMessage(error) : error.message;
};

// List of custom error messages getters
const errorMessages = {
  /*
  maxLength({ params: { limit } }) {
    return `should not be longer than ${limit} characters`;
  },
  */
};


module.exports = {
  reportErrors,
};
