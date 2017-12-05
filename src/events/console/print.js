'use strict';

const { getConsoleMessage } = require('./message');
const { colorize } = require('./colorize');

// Prints event messages to console.
const consolePrint = function ({ vars, vars: { level }, duration }) {
  const consoleMessage = getConsoleMessage({ vars, duration });

  const consoleMessageA = colorize({ vars, consoleMessage });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA);
};

module.exports = {
  consolePrint,
};
