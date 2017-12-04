'use strict';

const { NO_CONSOLE_TYPES } = require('../constants');

const { getConsoleMessage } = require('./message');
const { colorize } = require('./colorize');

// Prints event messages to console.
const consolePrint = function ({
  type,
  level,
  phase,
  duration,
  message,
  eventPayload,
}) {
  if (NO_CONSOLE_TYPES.includes(type)) { return; }

  const consoleMessage = getConsoleMessage({
    duration,
    type,
    phase,
    message,
    eventPayload,
  });

  const consoleMessageA = colorize({ type, level, consoleMessage });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA);
};

module.exports = {
  consolePrint,
};
