'use strict';

const { errorMessages } = require('./messages');

// Customize error messages when the library's ones are unclear
const getErrorMessage = function ({ error, hasInputPath }) {
  const customErrorMessage = errorMessages[error.keyword];
  // Failsafe
  if (!customErrorMessage) { return ` ${error.message}`; }
  const message = customErrorMessage(error);

  if (!hasInputPath && message[0] === '.') {
    return message.substring(1);
  }

  return message;
};

module.exports = {
  getErrorMessage,
};
