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

const getEventLabel = function (label, { name }) {
  return `${name}.${label}`;
};

// Shutdown success events
const handleEvent = async function ({ func, successMessage }, input) {
  const { runOpts, schema, title } = input;

  const response = await func(input);

  const message = result(successMessage, response);
  const messageA = `${title} - ${message}`;
  await emitEvent({
    type: 'message',
    phase: 'shutdown',
    message: messageA,
    runOpts,
    schema,
  });

  return response;
};

// Shutdown failures events
const handleEventHandler = async function (
  error,
  { errorMessage, reason },
  { runOpts, schema, title },
) {
  const message = `${title} - ${errorMessage}`;
  const errorA = normalizeError({ error, reason });
  await emitEvent({
    type: 'failure',
    phase: 'shutdown',
    message,
    vars: { error: errorA },
    runOpts,
    schema,
  });
};

const eHandleEvent = addErrorHandler(handleEvent, handleEventHandler);

module.exports = {
  wrapCloseFunc,
};
