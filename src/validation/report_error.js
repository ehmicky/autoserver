'use strict';

const { throwError } = require('../error');

const { getErrorMessage } = require('./message');

// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors, dataVar, message, reason }) {
  // Retrieve error message as string, from error objects
  const errorsText = errors
    .map(error => reportError({ error, dataVar }))
    .join('\n');

  const messageA = `${message}: ${errorsText}`;
  throwError(messageA, { reason });
};

// Transform an error object to an error message
const reportError = function ({ error, error: { dataPath: path }, dataVar }) {
  const pathA = addDataVar({ dataVar, path });
  const pathB = jsonPointerToDots(pathA);

  // Get custom error message
  const message = getErrorMessage({ error, path: pathB });

  // Prepends argument name to error message
  return `${pathB}${message}`;
};

// Prepends argument name, e.g. `filter.attr` instead of `attr`
const addDataVar = function ({ dataVar, path }) {
  if (dataVar === undefined) { return path; }

  return `/${dataVar}${path}`;
};

// We use `jsonPointers` option because it is cleaner,
// but we want dots (for properties) and brackets (for indexes) not slashes
const jsonPointerToDots = function (path) {
  return path
    .substr(1)
    .replace(/\/(\d+)/g, '[$1]')
    .replace(/\//g, '.');
};

module.exports = {
  reportErrors,
};
