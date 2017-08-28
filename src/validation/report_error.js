'use strict';

const { throwError } = require('../error');

const { getErrorMessage } = require('./message');

// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, dataVar, reason, message }) {
  // Retrieve error message as string, from error objects
  const extraNewline = errors.length > 1 ? '\n' : '';
  const errorsText = extraNewline + errors
    .map(error => {
      const { dataPath } = error;
      // Prepends argument name, e.g. `filter.attr` instead of `attr`
      const prefix = dataVar ? `/${dataVar}` : '';
      const inputPath = `${prefix}${dataPath}`
        .substr(1)
        // We use `jsonPointers` option because it is cleaner,
        // but we want dots (for properties) and brackets (for indexes)
        // not slashes
        .replace(/\/([0-9]+)/g, '[$1]')
        .replace(/\//g, '.');
      const hasInputPath = inputPath !== '';

      // Get custom error message
      const msg = getErrorMessage({ error, hasInputPath });
      // Prepends argument name to error message
      return `${inputPath}${msg}`;
    })
    .join('\n');

  const errorsMessage = message ? `${message}: ${errorsText}` : errorsText;

  throwError(errorsMessage, { reason });
};

module.exports = {
  reportErrors,
};
