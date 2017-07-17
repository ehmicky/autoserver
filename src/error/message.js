'use strict';

const { resolve } = require('path');

// Retrieve error message of a standard error
const getErrorMessage = function ({
  error: {
    type,
    description,
    protocol,
    operation,
    action_path: actionPath,
    command,
    details,
  },
}) {
  // Retrieve both the main message and the stack
  const stack = getStack(description, details);

  // Add request-related info to message
  const message = [
    protocol,
    operation,
    actionPath,
    command,
  ].filter(val => val)
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
  const dirPrefixRegExp = new RegExp(apiEngineDirName, 'g');
  const trimmedStack = stack.replace(dirPrefixRegExp, '');

  return trimmedStack;
};

const apiEngineDirName = resolve(__dirname, '../..');

module.exports = {
  getErrorMessage,
};
