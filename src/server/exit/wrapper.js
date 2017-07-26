'use strict';

const { getStandardError } = require('../../error');
const { monitor } = require('../../perf');

// Add logging and monitoring capabilities to the function
const wrapCloseFunc = function (func, { successMessage, errorMessage, label }) {
  const handledFunc = handleLog(func, { successMessage, errorMessage });
  const getLabel = ({ protocol }) => `${protocol}.${label}`;
  const monitoredFunc = monitor(handledFunc, getLabel);
  return monitoredFunc;
};

// Log shutdown failures
const handleLog = function (func, { successMessage, errorMessage }) {
  return async function errorHandler (input) {
    const { log, protocol } = input;

    try {
      const response = await func(input);
      const message = typeof successMessage === 'function'
        ? successMessage(response)
        : successMessage;
      await log.log(`${protocol} - ${message}`);
      return response;
    } catch (error) {
      const message = `${protocol} - ${errorMessage}`;
      const errorInfo = getStandardError({ log, error });
      await log.error(message, { type: 'failure', errorInfo });
    }
  };
};

module.exports = {
  wrapCloseFunc,
};
