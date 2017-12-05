'use strict';

const { logEvent } = require('../../log');
const { pickBy, getWordsList } = require('../../utilities');

// Emit successful or failed shutdown event
const emitStopEvent = async function ({ exitcodes, schema, measures }) {
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

  const { duration } = measures.find(({ category }) => category === 'default');

  await logEvent({
    type: 'stop',
    phase: 'shutdown',
    level,
    message,
    vars: { exitcodes },
    schema,
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
