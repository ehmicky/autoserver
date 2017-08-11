'use strict';

const { normalizeError, getStandardError } = require('../../error');
const { pSetTimeout } = require('../../utilities');
const { emitEventAsync } = require('../../events');
const { LEVELS } = require('../constants');

const { getReportedLog } = require('./reported_log');
const { consolePrint } = require('./console');
const { getConsoleMessage } = require('./console');

// Report some logs, i.e.:
//  - fire runtime option `logger(info)`
//  - print to console
const reportLog = async function ({
  log,
  type,
  phase = log.phase,
  level,
  message,
  info,
  delay,
}) {
  const levelA = getLevel({ level, type });

  const noLogging = !shouldLog({ log, level: levelA });
  if (noLogging) { return; }

  // Retrieves information sent to event, and message printed to console
  const reportedLog = getReportedLog({ log, type, phase, level: levelA, info });
  const messageA = getConsoleMessage({ message, ...reportedLog });
  const reportedLogA = { ...reportedLog, message: messageA };

  consolePrint({ type, level: levelA, message: messageA });

  await emitLogEvent({
    log,
    type,
    phase,
    level: levelA,
    reportedLog: reportedLogA,
    delay,
  });
};

// Can filter verbosity with runtime option `eventLevel`
const shouldLog = function ({ log: { runtimeOpts: { eventLevel } }, level }) {
  return eventLevel !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(eventLevel);
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

// Try emit log event with an increasing delay
const emitLogEvent = async function ({
  log,
  log: { apiServer },
  type,
  phase,
  level,
  reportedLog,
  delay = defaultDelay,
}) {
  try {
    const eventName = `log.${phase}.${type}.${level}`;
    await emitEventAsync({ apiServer, name: eventName, data: reportedLog });
  } catch (error) {
    await handleLoggingError({ log, type, level, reportedLog, error, delay });
  }
};

const handleLoggingError = async function ({
  log,
  type,
  level,
  reportedLog,
  error,
  delay,
}) {
  // Tries again ang again, with an increasing delay
  if (delay > maxDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * delayExponent;

  // First, report that logging failed
  await reportLoggerError({ log, error, delay: delayA });

  // Then, try to report original error again
  await emitLogEvent({ log, type, level, reportedLog, delay: delayA });
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

const reportLoggerError = async function ({ log, error, delay }) {
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
  reportLog,
};
