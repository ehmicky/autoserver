'use strict';

const { promisify } = require('util');

const { getMessage } = require('./message');
const { colorize } = require('./colorize');
const { consolePrint } = require('./console');

// Report some logs, i.e.:
//  - fire server option `logger(info)`
//  - print to console
const report = async function ({
  apiServer,
  loggerLevel,
  level,
  rawMessage,
  logObj,
}) {
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

  const eventName = `log.${phase}.${type}.${level}`;
  const info = Object.assign({}, logObj, { timestamp, type, level });

  // Build a standardized log message
  const noConsole = noConsoleTypes.includes(type);
  let message;

  if (!noConsole) {
    message = getMessage({
      phase,
      type,
      level,
      timestamp,
      requestId,
      serverName,
      rawMessage,
    });
    info.message = message;
  }

  await tryToLog({ apiServer, eventName, info });

  // Add colors, only for console
  if (!noConsole) {
    const colorMessage = colorize({ type, level, message });
    consolePrint({ level, message: colorMessage, loggerLevel });
  }
};

// Those log types never prints to console
const noConsoleTypes = ['perf'];

// Try to log with an increasing delay
const tryToLog = async function ({
  apiServer,
  eventName,
  info,
  delay = defaultDelay,
}) {
  try {
    await apiServer.emitAsync(eventName, info);
  } catch (innererror) {
    if (delay > maxDelay) { return; }
    await promisify(setTimeout)(delay);

    addLoggerError({ info, innererror });
    delay *= delayExponent;
    await tryToLog({ apiServer, eventName, info, delay });
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
