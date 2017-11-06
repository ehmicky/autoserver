'use strict';

const { resolve } = require('path');

// Retrieve error message of a standard error
const getErrorMessage = function ({
  error: {
    type,
    description,
    protocol,
    operation,
    commandpath,
    command,
    details,
  },
}) {
  // Retrieve both the main message and the stack
  const stack = getStack(description, details);

  // Add request-related info to message
  const message = [protocol, operation, commandpath, command]
    .filter(val => val)
    .join(' ');

  const messageStack = message && stack
    ? `${message}\n${stack}`
    : (message || stack);

  // Add error type to message
  const fullMessage = messageStack ? `${type} - ${messageStack}` : type;

  return fullMessage;
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
