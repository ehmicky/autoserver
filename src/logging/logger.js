'use strict';


const { colorize } = require('./colorize');


const levels = ['info', 'log', 'warn', 'error'];
const levelsMaxLength = Math.max(...levels.map(level => level.length));

const types = ['generic', 'startup', 'failure', 'request'];
const typesMaxLength = Math.max(...types.map(type => type.length));
const noConsoleTypes = [];

const requestIdLength = 36;

const report = function (logger, loggerLevel, level, rawMessage, logObj) {
  const {
    type = 'generic',
    requestInfo: {
      // Used in message prefix
      requestId = '',
      // Reuse the request timestamp if possible
      timestamp = (new Date()).toISOString(),
    } = {},
  } = logObj;

  const info = Object.assign({}, logObj);

  info.timestamp = timestamp;

  const prefix = getPrefix({ type, level, timestamp, requestId });
  const message = getMessage({ prefix, rawMessage, level });

  Object.assign(info, { type, level, message });

  if (logger) {
    logger(info);
  }

  consolePrint({ type, level, message, loggerLevel });
};

const getPrefix = function ({ type, level, timestamp, requestId }) {
  const logType = type.toUpperCase().padEnd(typesMaxLength);
  const logLevel = level.toUpperCase().padEnd(levelsMaxLength);
  const logRequestId = requestId.padEnd(requestIdLength);

  const prefix = `[${logType}] [${logLevel}] [${timestamp}] [${logRequestId}]`;
  return prefix;
};

const getMessage = function ({ prefix, rawMessage, level }) {
  const message = `${prefix} ${rawMessage}`;
  const colorMessage = colorize(level, message);
  return colorMessage;
};

const consolePrint = function ({ type, level, message, loggerLevel }) {
  const noConsolePrint = noConsoleTypes.includes(type) ||
    loggerLevel === 'silent' ||
    levels.indexOf(level) < levels.indexOf(loggerLevel);
  if (noConsolePrint) { return; }

  global.console[level](message);
};


module.exports = {
  report,
};
