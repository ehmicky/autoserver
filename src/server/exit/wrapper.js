'use strict';

const { getStandardError } = require('../../error');
const { monitor } = require('../../perf');
const { reportLog } = require('../../logging');

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
      const messageA = `${protocol} - ${message}`;
      await reportLog({ log, type: 'message', message: messageA });
      return response;
    } catch (error) {
      const errorInfo = getStandardError({ log, error });
      const message = `${protocol} - ${errorMessage}`;
      await reportLog({ log, type: 'failure', message, info: { errorInfo } });
    }
  };
};

module.exports = {
  wrapCloseFunc,
};
