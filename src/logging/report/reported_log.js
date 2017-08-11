'use strict';

const { getServerInfo } = require('../../info');

const { getRequestInfo } = require('./request_info');
const { getConsoleMessage } = require('./console');

const getReportedLog = function ({
  level,
  log,
  phase,
  log: { runtimeOpts },
  message: rawMessage = '',
  info = {},
  info: { type = 'message', errorInfo } = {},
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
  const message = getConsoleMessage({
    phase,
    type,
    level,
    timestamp,
    requestId,
    requestInfo,
    serverInfo,
    rawMessage,
  });

  return {
    ...info,
    requestInfo,
    errorInfo: errorInfoB,
    phase,
    type,
    serverInfo,
    timestamp,
    level,
    message,
  };
};

module.exports = {
  getReportedLog,
};
