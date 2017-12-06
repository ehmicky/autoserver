'use strict';

const { pickBy, getWordsList } = require('../../utilities');
const { logEvent } = require('../../log');
const { nanoSecsToMilliSecs } = require('../../perf');

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

  const duration = getDuration({ measures });

  await logEvent({
    event: 'stop',
    phase: 'shutdown',
    level,
    message,
    vars: { exitcodes, duration },
    schema,
  });
};

// Retrieves which servers exits have failed, if any
const getFailedProtocols = function ({ exitcodes }) {
  const failedExitcodes = pickBy(exitcodes, exitcode => !exitcode);
  const failedProtocols = Object.keys(failedExitcodes);
  return failedProtocols;
};

const getDuration = function ({ measures }) {
  const { duration } = measures.find(({ category }) => category === 'default');
  const durationA = nanoSecsToMilliSecs({ duration });
  return durationA;
};

module.exports = {
  emitStopEvent,
};
