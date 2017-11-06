'use strict';

const { normalizeError } = require('../../error');
const { emitEvent } = require('../../events');

// If error handler fails, only reports failure then gives up
const failureHandler = async function ({
  error,
  protocolHandler,
  protocolstatus,
  specific,
  runOpts,
}) {
  const errorA = normalizeError({ error, reason: 'ERROR_HANDLER_FAILURE' });

  await reportError({ runOpts, error: errorA });

  // Make sure a response is sent, even empty, or the socket will hang
  await protocolHandler.send({ specific, protocolstatus, contentLength: 0 });
};

const reportError = function ({ runOpts, error }) {
  return emitEvent({
    type: 'failure',
    phase: 'request',
    level: 'error',
    errorinfo: error,
    runOpts,
  });
};

module.exports = {
  failureHandler,
};
