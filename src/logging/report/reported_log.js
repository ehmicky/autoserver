'use strict';

const { getServerInfo } = require('../../info');

const { getRequestInfo } = require('./request_info');
const { getConsoleMessage } = require('./console');

const getReportedLog = function ({
  log,
  log: { runtimeOpts },
  type,
  phase,
  level,
  message,
  info = {},
  info: { errorInfo } = {},
}) {
  // Adds information common to most logs: `phase`, `type`, `serverInfo`,
  // `requestInfo`, `messages`
  const serverInfo = getServerInfo({ runtimeOpts });
  const {
    requestInfo,
    errorInfo: errorInfoA,
  } = getRequestInfo({ log, phase, info }) || {};
  const errorInfoB = errorInfoA || errorInfo;
  const {
    // Used in message prefix
    requestId,
    // Reuse the request timestamp if possible
    timestamp = (new Date()).toISOString(),
  } = requestInfo || {};

  // Build a standardized log message
  const messageA = getConsoleMessage({
    type,
    phase,
    level,
    message,
    info,
    timestamp,
    requestId,
    requestInfo,
    serverInfo,
  });

  return {
    ...info,
    type,
    phase,
    level,
    message: messageA,
    errorInfo: errorInfoB,
    timestamp,
    requestInfo,
    serverInfo,
  };
};

module.exports = {
  getReportedLog,
};
