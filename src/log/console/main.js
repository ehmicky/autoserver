'use strict';

const { getConsoleMessage } = require('./message');
const { colorize } = require('./colorize');

// Prints event messages to console.
const consolePrint = function ({ vars, vars: { level }, isPerf }) {
  if (isPerf) { return; }

  const consoleMessage = getConsoleMessage({ vars });

  const consoleMessageA = colorize({ vars, consoleMessage });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA);
};

module.exports = {
  consolePrint,
};
