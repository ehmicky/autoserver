'use strict';

const { getErrorMessage } = require('../../error');
const { NO_CONSOLE_TYPES } = require('../constants');

const { getPrefix } = require('./prefix');
const { getRequestMessage } = require('./request_message');

// Build a standardized event message:
// [TYPE] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestid if phase is `request`
const getConsoleMessage = function ({
  message,
  duration,
  eventPayload: {
    type,
    phase,
    level,
    errorinfo,
    timestamp,
    requestinfo,
    serverinfo,
  },
}) {
  const noConsole = NO_CONSOLE_TYPES.includes(type);
  if (noConsole) { return; }

  const prefix = getPrefix({
    type,
    phase,
    level,
    timestamp,
    requestinfo,
    serverinfo,
  });
  const messageA = getMessage({ message, type, phase, errorinfo, requestinfo });
  const durationA = getDuration({ duration });

  const messageC = `${prefix} ${durationA} ${messageA}`;
  return messageC;
};

const getMessage = function ({
  message = '',
  type,
  phase,
  errorinfo,
  requestinfo,
}) {
  if (type === 'failure') {
    const errorMessage = getErrorMessage({ error: errorinfo });
    return message ? `${message}\n${errorMessage}` : errorMessage;
  }

  if (type === 'call' && phase === 'request') {
    return getRequestMessage(requestinfo);
  }

  return message;
};

// Adds how long startup, shutdown or request took
const getDuration = function ({ duration }) {
  if (!duration) {
    return ' '.repeat(DURATION_LENGTH);
  }

  const durationMs = Math.round(duration / NANOSECS_TO_MILLISECS);
  const durationText = `${durationMs}ms`.padEnd(DURATION_LENGTH - 2);
  return `[${durationText}]`;
};

const NANOSECS_TO_MILLISECS = 1e6;
const DURATION_LENGTH = 8;

module.exports = {
  getConsoleMessage,
};
