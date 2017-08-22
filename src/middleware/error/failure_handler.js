'use strict';

const { emitEvent } = require('../../events');

// If error handler fails, only reports failure then gives up
const failureHandler = async function ({
  error,
  reqInfo,
  protocolHandler,
  protocolHandler: { failureProtocolStatus: status },
  specific,
  runOpts,
}) {
  const standardError = getStandardError({ error });

  await reportError({ reqInfo, runOpts, error: standardError });

  // Make sure a response is sent, or the socket will hang
  protocolHandler.send.nothing({ specific, status });

  return standardError;
};

const getStandardError = function ({ error }) {
  const details = error.stack || error;
  return {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    details,
  };
};

const reportError = function ({ reqInfo, runOpts, error }) {
  return emitEvent({
    reqInfo,
    type: 'failure',
    phase: 'request',
    level: 'error',
    errorInfo: error,
    runOpts,
  });
};

module.exports = {
  failureHandler,
};
