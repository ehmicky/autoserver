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

  const mInputA = { ...DEFAULT_MINPUT, ...mInput };

  // Report any exception thrown
  await emitEvent({
    mInput: mInputA,
    type: 'failure',
    phase: 'request',
    level: 'error',
    vars: { error },
    runOpts,
    schema,
  });
};

const DEFAULT_MINPUT = {
  status: 'SERVER_ERROR',
};

module.exports = {
  errorHandler,
};
