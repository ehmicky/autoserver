'use strict';

const { result } = require('../../utilities');
const { addErrorHandler, normalizeError } = require('../../error');
const { monitor } = require('../../perf');
const { emitEvent } = require('../../events');

// Add events and monitoring capabilities to the function
const wrapCloseFunc = function (
  func,
  { successMessage, errorMessage, label, reason },
) {
  const eFunc = eHandleEvent.bind(
    null,
    { func, successMessage, errorMessage, reason },
  );

  const getLabel = getEventLabel.bind(null, label);
  const mFunc = monitor(eFunc, getLabel, 'main');
  return mFunc;
};

const getEventLabel = function (label, input) {
  const prefix = getPrefix(input);
  return `${prefix}.${label}`;
};

const getPrefix = function ({ protocol, dbType }) {
  return protocol || dbType;
};

// Shutdown success events
const handleEvent = async function ({ func, successMessage }, input) {
  const { runOpts } = input;

  const response = await func(input);

  const message = result(successMessage, response);
  const prefix = getPrefix(input);
  const messageA = `${prefix} - ${message}`;
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
  { errorMessage, reason },
  input,
) {
  const { runOpts } = input;

  const prefix = getPrefix(input);
  const message = `${prefix} - ${errorMessage}`;
  const errorA = normalizeError({ error, reason });
  await emitEvent({
    type: 'failure',
    phase: 'shutdown',
    message,
    errorInfo: errorA,
    runOpts,
  });
};

const eHandleEvent = addErrorHandler(handleEvent, handleEventHandler);

module.exports = {
  wrapCloseFunc,
};
