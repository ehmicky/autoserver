'use strict';

const { EngineError } = require('../error');
const { validationTypes } = require('./types');
const { getErrorMessage } = require('./message');

// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, reportInfo: { type, dataVar } }) {
  // Retrieve error message as string, from error objects
  const extraNewline = errors.length > 1 ? '\n' : '';
  const errorsText = extraNewline + errors
    .map(error => {
      let inputPath = error.dataPath;
      // Prepends argument name, e.g. `filter.attr` instead of `attr`
      const prefix = dataVar ? `/${dataVar}` : '';
      inputPath = prefix + inputPath;
      inputPath = inputPath.substr(1);
      // We use `jsonPointers` option because it is cleaner,
      // but we want dots (for properties) and brackets (for indexes)
      // not slashes
      inputPath = inputPath
        .replace(/\/([0-9]+)/g, '[$1]')
        .replace(/\//g, '.');
      const hasInputPath = inputPath !== '';

      // Get custom error message
      const msg = getErrorMessage({ error, hasInputPath });
      // Prepends argument name to error message
      return `${inputPath}${msg}`;
    })
    .join('\n');

  const { reason, message } = validationTypes[type];

  const errorsMessage = message ? `${message}: ${errorsText}` : errorsText;

  throw new EngineError(errorsMessage, { reason });
};

module.exports = {
  reportErrors,
};
