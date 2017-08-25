'use strict';

const { emitEvent } = require('../../events');
const { pickBy } = require('../../utilities');

// Emit successful or failed shutdown event
const emitStopEvent = async function ({ statuses, runOpts, measures }) {
  const failedProtocols = getFailedProtocols({ statuses });

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
    info: { exitStatuses: statuses },
    runOpts,
    duration,
  });
};

// Retrieves which servers exits have failed, if any
const getFailedProtocols = function ({ statuses }) {
  const failedStatuses = pickBy(statuses, status => !status);
  const failedProtocols = Object.keys(failedStatuses);
  return failedProtocols;
};

module.exports = {
  emitStopEvent,
};
