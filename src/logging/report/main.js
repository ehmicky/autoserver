'use strict';

const { getReportedLog } = require('./reported_log');
const { emitLogEvent } = require('./event');
const { consolePrint } = require('./console');

// Report some logs, i.e.:
//  - fire server option `logger(info)`
//  - print to console
const reportLog = async function ({
  level,
  log,
  log: { phase, apiServer, serverOpts: { loggerLevel } },
  message,
  info,
  info: { type = 'message' } = {},
}) {
  const reportedLog = getReportedLog({ level, log, message, info });

  const eventName = `log.${phase}.${type}.${level}`;
  await emitLogEvent({ apiServer, eventName, reportedLog });

  consolePrint({ type, level, message: reportedLog.message, loggerLevel });
};

module.exports = {
  reportLog,
};
