'use strict';

const { pSetTimeout } = require('../../utilities');
const { emitEvent } = require('../../events');

// Error handler, which sends final response, if errors
const errorHandler = async function ({
  error,
  level,
  protocolHandler,
  specific,
  runOpts,
  mInput,
}) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  await reportError({ runOpts, level, error, mInput });

  // Make sure a response is sent, even empty, or the socket will hang
  await protocolHandler.send({ specific, content: '', contentLength: 0 });
};

// Report any exception thrown
const reportError = async function ({ runOpts, level, error, mInput }) {
  // If we haven't reached the events middleware yet, error.status
  // will be undefined, so it will still be caught and reported.
  const levelA = ['warn', 'error'].includes(level) ? level : 'error';

  await emitEvent({
    mInput,
    type: 'failure',
    phase: 'request',
    level: levelA,
    errorinfo: error,
    runOpts,
  });
};

module.exports = {
  errorHandler,
};
