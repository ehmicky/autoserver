'use strict';

const { emitEvent } = require('../../events');

// Error handler, which sends final response, if server-side errors
const errorHandler = async function ({
  error,
  protocolHandler,
  specific,
  runOpts,
  schema,
  mInput,
}) {
  // Make sure a response is sent, even empty, or the socket will hang
  await protocolHandler.send({ specific, content: '', contentLength: 0 });

  // Report any exception thrown
  await emitEvent({
    mInput,
    type: 'failure',
    phase: 'request',
    level: 'error',
    error,
    runOpts,
    schema,
  });
};

module.exports = {
  errorHandler,
};
