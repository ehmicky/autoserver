'use strict';

const { resolve } = require('path');

// Retrieve error message of a standard error
const getErrorMessage = function ({
  error: { type, description, details },
  message,
}) {
  // Retrieve both the main message and the stack
  const stack = getStack(description, details);

  // Add error type to message
  const errorMessage = stack ? `${type} - ${stack}` : type;

  // Add original event's message
  const errorMessageA = message ? `${message}\n${errorMessage}` : errorMessage;

  return errorMessageA;
};

const getStack = function (description, details = '') {
  // Only include description if it's not already in the stack trace
  const stack = !description || details.indexOf(description) !== -1
    ? details
    : `${description}\n${details}`;

  // Shorten stack trace directory paths
  const dirPrefixRegExp = new RegExp(ROOT_DIR, 'g');
  const trimmedStack = stack.replace(dirPrefixRegExp, '');

  return trimmedStack;
};

const ROOT_DIR = resolve(__dirname, '../..');

module.exports = {
  getErrorMessage,
};
