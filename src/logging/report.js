'use strict';


const { getMessage } = require('./message');
const { colorize } = require('./colorize');
const { consolePrint } = require('./console');
const { waitFor } = require('../utilities');


// Report some logs, i.e.:
//  - fire server option `logger(info)`
//  - print to console
const report = function ({
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

  tryToLog({ apiServer, eventName, info });

  // Add colors, only for console
  if (!noConsole) {
    const colorMessage = colorize({ type, level, message });
    consolePrint({ level, message: colorMessage, loggerLevel });
  }
};

// Those log types never prints to console
const noConsoleTypes = [];

// Try to log with an increasing delay
const tryToLog = async function ({
  apiServer,
  eventName,
  info,
  delay = defaultDelay,
}) {
  try {
    apiServer.emit(eventName, info);
  } catch (innererror) {
    if (delay > maxDelay) { return; }
    await waitFor(delay);

    addLoggerError({ info, innererror });
    tryToLog({ apiServer, eventName, info, delay: delay * delayExponent });
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
