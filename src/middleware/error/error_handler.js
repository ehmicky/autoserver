'use strict';

const { pSetTimeout } = require('../../utilities');
const { getStandardError } = require('../../error');
const { STATUS_LEVEL_MAP, emitEvent } = require('../../events');

// Error handler, which sends final response, if errors
const errorHandler = async function (input) {
  const {
    error,
    protocolHandler,
    protocolHandler: { failureProtocolStatus: status },
    specific,
    runOpts,
  } = input;

  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  const standardError = getStandardError({ error, input });

  await reportError({ runOpts, error: standardError, input });

  // Make sure a response is sent, or the socket will hang
  protocolHandler.send.nothing({ specific, status });

  return standardError;
};

// Report any exception thrown
const reportError = async function ({ runOpts, error, input }) {
  // If we haven't reached the events middleware yet, error.status
  // will be undefined, so it will still be caught and reported.
  const level = STATUS_LEVEL_MAP[error.status] || 'error';
  // Only report except with level 'warn' or 'error'
  if (!['warn', 'error'].includes(level)) { return; }

  await emitEvent({
    input,
    type: 'failure',
    phase: 'request',
    level,
    errorInfo: error,
    runOpts,
  });
};

module.exports = {
  errorHandler,
};
