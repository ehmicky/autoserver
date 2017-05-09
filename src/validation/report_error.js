'use strict';


const { validationTypes } = require('./types');
const { getErrorMessage } = require('./message');


// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, reportInfo }) {
  const type = reportInfo.type;
  // Retrieve error message as string, from error objects
  const extraNewline = errors.length > 1 ? '\n' : '';
  const errorsText = extraNewline + errors
    .map(error => {
      let inputPath = error.dataPath;
      // Prepends argument name, e.g. `filter.attr` instead of `attr`
      const prefix = reportInfo.dataVar ? `/${reportInfo.dataVar}` : '';
      inputPath = prefix + inputPath;
      inputPath = inputPath.substr(1);
      // We use `jsonPointers` option because it is cleaner,
      // but we want dots (for properties) and brackets (for indexes) not slashes
      inputPath = inputPath
        .replace(/\/([0-9]+)/g, '[$1]')
        .replace(/\//g, '.');
      const hasInputPath = inputPath !== '';

      // Get custom error message
      const message = getErrorMessage({ error, hasInputPath });
      // Prepends argument name to error message
      return `${inputPath}${message}`;
    })
    .join('\n');

  const { reason, ErrorType, messageProcessor } = validationTypes[type];

  const errorsMessage = messageProcessor ? messageProcessor({ message: errorsText, reportInfo }) : errorsText;

  throw new ErrorType(errorsMessage, { reason });
};


module.exports = {
  reportErrors,
};
