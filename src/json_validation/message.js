'use strict';

const { errorMessages } = require('./messages');

// Customize error messages when the library's ones are unclear
const getErrorMessage = function ({
  error,
  error: { keyword, message },
  path,
}) {
  const getMessage = errorMessages[keyword];

  // Failsafe
  if (getMessage === undefined) {
    return ` ${message}`;
  }

  const messageA = getMessage(error);

  const messageB = removeLeadingDot({ path, message: messageA });

  return messageB;
};

// When error message starts with `.var` but no `data` was prefixed, remove `.`
const removeLeadingDot = function ({ path, message }) {
  if (path !== '' || message[0] !== '.') { return message; }

  return message.substring(1);
};

module.exports = {
  getErrorMessage,
};
