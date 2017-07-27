'use strict';

const { normalizeError } = require('../error');
const { pSetTimeout } = require('../utilities');

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
  logObj: {
    type,
    requestInfo: {
      // Used in message prefix
      requestId,
      // Reuse the request timestamp if possible
      timestamp = (new Date()).toISOString(),
    } = {},
    serverInfo: { serverName },
    phase,
  },
}) {
  const eventName = `log.${phase}.${type}.${level}`;
  const info = Object.assign({}, logObj, { timestamp, type, level });

  // Build a standardized log message
  const noConsole = noConsoleTypes.includes(type);
  const message = getMessage({
    noConsole,
    phase,
    type,
    level,
    timestamp,
    requestId,
    serverName,
    rawMessage,
  });

  if (message) {
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
  } catch (error) {
    if (delay > maxDelay) { return; }
    await pSetTimeout(delay);

    addLoggerError({ info, error });
    const newDelay = delay * delayExponent;
    await tryToLog({ apiServer, eventName, info, delay: newDelay });
  }
};

const defaultDelay = 1000;
const delayExponent = 5;
const maxDelay = 1000 * 60 * 3;

// Keep track of the error the logging utility threw
const addLoggerError = function ({ info, error, error: { stack = '' } }) {
  const { message } = normalizeError({ error });
  const loggerError = `${message} ${stack}`;
  info.loggerErrors = info.loggerErrors || [];
  info.loggerErrors.push(loggerError);
};

module.exports = {
  report,
};
