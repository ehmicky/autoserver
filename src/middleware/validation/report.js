'use strict';


const { EngineError } = require('../../error');


// Report errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors }) {
  // Retrieve error message as string, from error objects
  const errorsText = '\n' + errors
    .map(error => {
      let inputPath;
      // Avoid reporting id error as `id.id is wrong`
      if (['ids', 'id'].includes(error.argName)) {
        inputPath = error.dataPath.substr(1);
      } else {
        inputPath = error.argName + error.dataPath;
      }

      // Get (potentially custom) error message
      const message = getErrorMessage({ error });
      // Prepends argument name to error message
      const errorText = `${inputPath} ${message}`;
      return errorText;
    })
    .join('\n');
  throw new EngineError(errorsText, { reason: 'INPUT_VALIDATION' });
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
