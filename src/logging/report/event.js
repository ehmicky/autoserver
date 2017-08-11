'use strict';

const { normalizeError, getStandardError } = require('../../error');
const { pSetTimeout, makeAlmostImmutable } = require('../../utilities');

// Try emit log event with an increasing delay
const eEmitLogEvent = async function ({
  log,
  type,
  reportedLog,
  delay = defaultDelay,
  reportLog,
}) {
  try {
    return await emitLogEvent({ log, type, reportedLog });
  } catch (error) {
    await handleLogError({ log, type, reportedLog, error, delay, reportLog });
  }
};

const emitLogEvent = async function ({
  log: { runtimeOpts: { events } },
  type,
  reportedLog,
}) {
  const eventHandler = events[type];
  if (!eventHandler) { return; }

  const reportedLogA = makeAlmostImmutable(reportedLog, ['servers']);
  await eventHandler(reportedLogA);

  return reportedLogA;
};

const handleLogError = async function ({
  log,
  type,
  reportedLog,
  error,
  delay,
  reportLog,
}) {
  // Tries again ang again, with an increasing delay
  if (delay > maxDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * delayExponent;

  // First, report that logging failed
  await reportLoggerError({ log, error, delay: delayA, reportLog });

  // Then, try to report original error again
  await eEmitLogEvent({ log, type, reportedLog, delay: delayA, reportLog });
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

const reportLoggerError = async function ({ log, error, delay, reportLog }) {
  // Do not report logging error created by another logging error
  // I.e. only report the first one, but tries to report it again and again
  if (delay > defaultDelay * delayExponent) { return; }

  const errorA = normalizeError({ error, reason: 'LOGGING_ERROR' });
  const errorB = getStandardError({ log, error: errorA });
  await reportLog({
    log,
    type: 'failure',
    phase: 'process',
    info: { errorInfo: errorB },
    delay,
  });
};

module.exports = {
  emitLogEvent: eEmitLogEvent,
};
