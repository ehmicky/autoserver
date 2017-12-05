'use strict';

const { result } = require('../../utilities');
const { addErrorHandler, normalizeError } = require('../../error');
const { monitor } = require('../../perf');
const { logEvent } = require('../../log');

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

const getEventLabel = function (label, { name }) {
  return `${name}.${label}`;
};

// Shutdown success events
const handleEvent = async function ({ func, successMessage }, input) {
  const { schema, title } = input;

  const response = await func(input);

  const message = result(successMessage, response);
  const messageA = `${title} - ${message}`;
  await logEvent({
    event: 'message',
    phase: 'shutdown',
    message: messageA,
    schema,
  });

  return response;
};

// Shutdown failures events
const handleEventHandler = async function (
  error,
  { errorMessage, reason },
  { schema, title },
) {
  const message = `${title} - ${errorMessage}`;
  const errorA = normalizeError({ error, reason });
  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message,
    vars: { error: errorA },
    schema,
  });
};

const eHandleEvent = addErrorHandler(handleEvent, handleEventHandler);

module.exports = {
  wrapCloseFunc,
};
