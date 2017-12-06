'use strict';

const { getConsoleMessage } = require('./message');
const { colorize } = require('./colorize');

// Prints event messages to console.
const report = function ({ log, log: { level } }) {
  const consoleMessage = getConsoleMessage({ log });

  const consoleMessageA = colorize({ log, consoleMessage });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA);
};

module.exports = {
  report,
};
