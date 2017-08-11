'use strict';

const { NO_CONSOLE_TYPES } = require('../../constants');

const { colorize } = require('./colorize');

// Prints logs messages to console.
const consolePrint = function ({ type, level, message }) {
  if (NO_CONSOLE_TYPES.includes(type)) { return; }

  const colorMessage = colorize({ type, level, message });

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](colorMessage);
};

module.exports = {
  consolePrint,
};
