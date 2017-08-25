'use strict';

const { getErrorMessage } = require('../../error');
const { NO_CONSOLE_TYPES } = require('../constants');

const { getPrefix } = require('./prefix');
const { getRequestMessage } = require('./request_message');

// Build a standardized event message:
// [TYPE] [LEVEL] [SERVER_NAME] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestId if phase is `request`
const getConsoleMessage = function ({
  message,
  duration,
  type,
  phase,
  level,
  errorInfo,
  timestamp,
  requestInfo,
  serverInfo: { serverName },
}) {
  const noConsole = NO_CONSOLE_TYPES.includes(type);
  if (noConsole) { return; }

  const prefix = getPrefix({
    type,
    phase,
    level,
    timestamp,
    requestInfo,
    serverName,
  });
  const messageA = getMessage({ message, type, phase, errorInfo, requestInfo });
  const durationA = getDuration({ duration });

  const messageC = `${prefix} ${durationA} ${messageA}`;
  return messageC;
};

const getMessage = function ({
  message = '',
  type,
  phase,
  errorInfo,
  requestInfo,
}) {
  if (type === 'failure') {
    const errorMessage = getErrorMessage({ error: errorInfo });
    return message ? `${message}\n${errorMessage}` : errorMessage;
  }

  if (type === 'call' && phase === 'request') {
    return getRequestMessage(requestInfo);
  }

  return message;
};

// Adds how long startup, shutdown or request took
const getDuration = function ({ duration }) {
  if (!duration) {
    return ' '.repeat(DURATION_LENGTH);
  }

  const durationMs = Math.round(duration / 10 ** 6);
  const durationText = `${durationMs}ms`.padEnd(DURATION_LENGTH - 2);
  return `[${durationText}]`;
};

const DURATION_LENGTH = 8;

module.exports = {
  getConsoleMessage,
};
