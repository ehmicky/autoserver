'use strict';

const { emitEvent } = require('../../events');
const { pickBy } = require('../../utilities');

// Emit successful or failed shutdown event
const emitStopEvent = async function ({ exitcodes, runOpts, measures }) {
  const failedProtocols = getFailedProtocols({ exitcodes });

  const isSuccess = failedProtocols.length === 0;
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';

  const { duration } = measures.find(({ category }) => category === 'default');

  await emitEvent({
    type: 'stop',
    phase: 'shutdown',
    level,
    message,
    info: { exitcodes },
    runOpts,
    duration,
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
