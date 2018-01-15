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

  // Prepends argument name to error message
  const messageB = `${path}${messageA}`;

  const messageC = removeLeadingDot({ message: messageB });

  const messageD = addQuotes({ message: messageC });

  return messageD;
};

// When error message starts with `.var` but no `data` was prefixed, remove `.`
const removeLeadingDot = function ({ message }) {
  if (message[0] !== '.') { return message; }

  return message.substring(1);
};

// Add quotes around variable path
const addQuotes = function ({ message }) {
  return message.replace(QUOTES_REGEXP, '\'$1\'');
};

const QUOTES_REGEXP = /^([^ ]+)/;

module.exports = {
  getErrorMessage,
};
