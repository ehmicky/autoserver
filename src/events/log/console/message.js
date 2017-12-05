'use strict';

const { getErrorMessage } = require('../../../error');

const { getPrefix } = require('./prefix');
const { getRequestMessage } = require('./request_message');

// Build a standardized event message:
// [TYPE] [LEVEL] [PROCESSNAME] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestid if phase is `request`
const getConsoleMessage = function ({ vars, duration }) {
  return parts
    .map(getPart => getPart({ vars, duration }))
    .join(' ');
};

const getMessage = function ({
  vars,
  vars: { type, phase, error, message = '' },
}) {
  if (type === 'failure') {
    const errorMessage = getErrorMessage({ error });
    return message ? `${message}\n${errorMessage}` : errorMessage;
  }

  if (type === 'call' && phase === 'request') {
    return getRequestMessage(vars);
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

const parts = [
  getPrefix,
  getDuration,
  getMessage,
];

module.exports = {
  getConsoleMessage,
};
