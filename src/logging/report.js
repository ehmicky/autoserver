'use strict';


const { getMessage } = require('./message');
const { colorize } = require('./colorize');
const { consolePrint } = require('./console');
const { waitFor } = require('../utilities');


// Report some logs, i.e.:
//  - fire server option `logger(info)`
//  - print to console
const report = function (logger, loggerLevel, level, rawMessage, logObj) {
  const {
    type,
    requestInfo: {
      // Used in message prefix
      requestId,
      // Reuse the request timestamp if possible
      timestamp = (new Date()).toISOString(),
    } = {},
    serverInfo: {
      serverName,
    },
    phase,
  } = logObj;

  // Build a standardized log message
  const message = getMessage({
    phase,
    type,
    level,
    timestamp,
    requestId,
    serverName,
    rawMessage,
  });

  if (logger) {
    const info = Object.assign({}, logObj, { timestamp, type, level, message });
    tryToLog({ logger, info });
  }

  // Add colors, only for console
  const colorMessage = colorize({ type, level, message });
  consolePrint({ type, level, message: colorMessage, loggerLevel });
};

// Try to log with an increasing delay
const tryToLog = async function ({ logger, info, delay = defaultDelay }) {
  try {
    await logger(info);
  } catch (innererror) {
    if (delay > maxDelay) { return; }
    await waitFor(delay);

    addLoggerError({ info, innererror });
    tryToLog({ logger, info, delay: delay * delayExponent });
  }
};
const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

// Keep track of the error the logging utility threw
const addLoggerError = function ({ info, innererror }) {
  const loggerError = innererror instanceof Error
    ? `${innererror.message} ${innererror.stack || ''}`
    : (typeof innererror === 'string' ? innererror : '');
  info.loggerErrors = info.loggerErrors || [];
  info.loggerErrors.push(loggerError);
};


module.exports = {
  report,
};
