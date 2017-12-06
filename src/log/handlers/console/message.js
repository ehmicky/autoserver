'use strict';

const { getErrorMessage } = require('../../../error');

const { getPrefix } = require('./prefix');
const { getRequestMessage } = require('./request_message');

// Build a standardized event message:
// [EVENT] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestid if phase is `request`
const getConsoleMessage = function ({ log }) {
  return parts
    .map(getPart => getPart({ log }))
    .join(' ');
};

const getMessage = function ({
  log,
  log: { event, phase, error, message = '' },
}) {
  if (event === 'failure') {
    const errorMessage = getErrorMessage({ error });
    return message ? `${message}\n${errorMessage}` : errorMessage;
  }

  if (event === 'call' && phase === 'request') {
    return getRequestMessage(log);
  }

  return message;
};

// Adds how long startup, shutdown or request took
const getDuration = function ({ log: { duration } }) {
  if (duration === undefined) {
    return ' '.repeat(DURATION_LENGTH);
  }

  const durationMs = Math.round(duration / NANOSECS_TO_MILLISECS);
  const durationText = `${durationMs}ms`.padEnd(DURATION_LENGTH - 2);
  return `[${durationText}]`;
};

const NANOSECS_TO_MILLISECS = 1e6;
const DURATION_LENGTH = 8;

const parts = [
  getPrefix,
  getDuration,
  getMessage,
];

module.exports = {
  getConsoleMessage,
};
