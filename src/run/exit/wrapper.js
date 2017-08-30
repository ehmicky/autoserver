'use strict';

const { addErrorHandler } = require('../../error');
const { monitor } = require('../../perf');
const { emitEvent } = require('../../events');

// Add events and monitoring capabilities to the function
const wrapCloseFunc = function (func, { successMessage, errorMessage, label }) {
  const eFunc = eHandleEvent.bind(null, { func, successMessage, errorMessage });

  const getLabel = getEventLabel.bind(null, label);
  const mFunc = monitor(eFunc, getLabel, 'main');
  return mFunc;
};

const getEventLabel = function (label, { protocol }) {
  return `${protocol}.${label}`;
};

// Shutdown success events
const handleEvent = async function ({ func, successMessage }, input) {
  const { protocol, runOpts } = input;

  const response = await func(input);

  const message = typeof successMessage === 'function'
    ? successMessage(response)
    : successMessage;
  const messageA = `${protocol} - ${message}`;
  await emitEvent({
    type: 'message',
    phase: 'shutdown',
    message: messageA,
    runOpts,
  });

  return response;
};

// Shutdown failures events
const handleEventHandler = async function (
  error,
  { errorMessage },
  { protocol, runOpts },
) {
  const message = `${protocol} - ${errorMessage}`;
  await emitEvent({
    type: 'failure',
    phase: 'shutdown',
    message,
    errorInfo: error,
    runOpts,
  });
};

const eHandleEvent = addErrorHandler(handleEvent, handleEventHandler);

module.exports = {
  wrapCloseFunc,
};
