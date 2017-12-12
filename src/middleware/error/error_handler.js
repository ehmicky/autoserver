'use strict';

const { logEvent } = require('../../log');

// Error handler, which sends final response, if server-side errors
const errorHandler = async function ({
  error,
  protocolAdapter,
  specific,
  config,
  mInput,
}) {
  // Make sure a response is sent, even empty, or the socket will hang
  await protocolAdapter.send({ specific, content: '', contentLength: 0 });

  const mInputA = { ...DEFAULT_MINPUT, ...mInput };

  // Report any exception thrown
  await logEvent({
    mInput: mInputA,
    event: 'failure',
    phase: 'request',
    level: 'error',
    vars: { error },
    config,
  });
};

const DEFAULT_MINPUT = {
  status: 'SERVER_ERROR',
};

module.exports = {
  errorHandler,
};
