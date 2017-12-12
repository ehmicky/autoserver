'use strict';

const { pickBy, getWordsList } = require('../../utilities');
const { logEvent } = require('../../log');
const { getDefaultDuration } = require('../../perf');

// Emit successful or failed shutdown event
const emitStopEvent = async function ({ exitcodes, config, measures }) {
  const failedProtocols = getFailedProtocols({ exitcodes });

  const isSuccess = failedProtocols.length === 0;
  const failedProtocolsA = getWordsList(
    failedProtocols,
    { op: 'and', quotes: true },
  );
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocolsA}`;
  const level = isSuccess ? 'log' : 'error';

  const duration = getDefaultDuration({ measures });

  await logEvent({
    event: 'stop',
    phase: 'shutdown',
    level,
    message,
    vars: { exitcodes, duration },
    config,
  });
};

// Retrieves which servers exits have failed, if any
const getFailedProtocols = function ({ exitcodes }) {
  const failedExitcodes = pickBy(exitcodes, exitcode => !exitcode);
  const failedProtocols = Object.keys(failedExitcodes);
  return failedProtocols;
};

module.exports = {
  emitStopEvent,
};
