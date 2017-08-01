'use strict';

const {
  normalizeError,
  getStandardError,
  getErrorMessage,
} = require('../../error');
const { pSetTimeout } = require('../../utilities');
const { emitEventAsync } = require('../../events');

const { getReportedLog } = require('./reported_log');
const { consolePrint } = require('./console');

// Report some logs, i.e.:
//  - fire server option `logger(info)`
//  - print to console
const reportLog = async function ({
  level,
  log,
  log: { serverOpts: { loggerLevel } },
  message,
  info,
  info: { type = 'message' } = {},
  isLogError,
}) {
  const reportedLog = getReportedLog({ level, log, message, info });

  consolePrint({ type, level, message: reportedLog.message, loggerLevel });

  await emitLogEvent({ level, log, info, reportedLog, isLogError });
};

// Try emit log event with an increasing delay
const emitLogEvent = async function ({
  level,
  log,
  log: { phase, apiServer },
  info,
  info: { type = 'message' } = {},
  reportedLog,
  isLogError,
  delay = defaultDelay,
}) {
  try {
    const eventName = `log.${phase}.${type}.${level}`;
    await emitEventAsync({ apiServer, name: eventName, data: reportedLog });
  } catch (error) {
    await handleLoggingError({
      error,
      level,
      log,
      info,
      reportedLog,
      isLogError,
      delay,
    });
  }
};

const handleLoggingError = async function ({
  error,
  level,
  log,
  info,
  reportedLog,
  isLogError,
  delay,
}) {
  // Tries again ang again, with an increasing delay
  if (delay > maxDelay) { return; }
  await pSetTimeout(delay);
  const delayA = delay * delayExponent;

  // First, report that logging failed
  await reportLoggerError({ error, log, isLogError });

  // Then, try to report original error again
  await emitLogEvent({ level, log, info, reportedLog, delay: delayA });
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

const reportLoggerError = async function ({ error, log, isLogError }) {
  // Do not report logging error created by another logging error
  // I.e. only report the first one, but tries to report it again and again
  if (isLogError) { return; }

  const errorA = normalizeError({ error, reason: 'LOGGING_ERROR' });
  const errorB = getStandardError({ log, error: errorA });
  const message = getErrorMessage({ error: errorB });
  await reportLog({
    log,
    level: 'error',
    message,
    info: { type: 'failure', errorInfo: errorB },
    isLogError: true,
  });
};

module.exports = {
  reportLog,
};
