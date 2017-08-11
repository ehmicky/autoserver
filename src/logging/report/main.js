'use strict';

const { LEVELS } = require('../constants');

const { getReportedLog } = require('./reported_log');
const { getConsoleMessage, consolePrint } = require('./console');
const { emitLogEvent } = require('./event');

// Report some logs, i.e.:
//  - fire runtime option `logger(info)`
//  - print to console
const reportLog = async function ({
  log = { logInfo: {} },
  type,
  phase,
  level,
  message,
  info,
  runtimeOpts = {},
  delay,
}) {
  const levelA = getLevel({ level, type });

  const noLogging = !shouldLog({ runtimeOpts, level: levelA });
  if (noLogging) { return; }

  // Retrieves information sent to event, and message printed to console
  const reportedLog = getReportedLog({
    log,
    type,
    phase,
    level: levelA,
    runtimeOpts,
    info,
  });
  const messageA = getConsoleMessage({ message, ...reportedLog });
  const reportedLogA = { ...reportedLog, message: messageA };

  consolePrint({ type, level: levelA, message: messageA });

  const reportedLogB = await emitLogEvent({
    log,
    type,
    runtimeOpts,
    reportedLog: reportedLogA,
    delay,
    reportLog,
  });
  return reportedLogB;
};

// Level defaults to `error` for type `failure`, and to `log` for other types
const getLevel = function ({ level, type }) {
  if (level) { return level; }

  if (type === 'failure') { return 'error'; }

  return 'log';
};

// Can filter verbosity with runtime option `eventLevel`
const shouldLog = function ({ runtimeOpts: { eventLevel }, level }) {
  return eventLevel !== 'silent' &&
    LEVELS.indexOf(level) >= LEVELS.indexOf(eventLevel);
};

module.exports = {
  reportLog,
};
