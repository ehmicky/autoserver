'use strict';

const { logEvent } = require('../../log');

// Error handler, which sends final response, if server-side errors
const errorHandler = async function ({
  error,
  protocolAdapter,
  config,
  mInput,
  mInput: { status } = {},
}) {
  // Only fire main error handler on server-side errors
  if (status && status !== 'SERVER_ERROR') { return; }

  // Make sure a response is sent, even empty, or the socket will hang
  await protocolAdapter.send({ content: '', contentLength: 0 });

  const mInputA = { ...DEFAULT_MINPUT, ...mInput };

  // Report any exception thrown
  await logEvent({
    mInput: mInputA,
    event: 'failure',
    phase: 'request',
    level: 'error',
    params: { error },
    config,
  });
};

const DEFAULT_MINPUT = {
  status: 'SERVER_ERROR',
};

module.exports = {
  errorHandler,
};
