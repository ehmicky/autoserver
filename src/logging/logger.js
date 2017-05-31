'use strict';


const { colorize } = require('./colorize');


const levels = ['info', 'log', 'warn', 'error'];
const levelsMaxLength = Math.max(...levels.map(level => level.length));

const types = ['generic', 'startup', 'failure', 'request'];
const typesMaxLength = Math.max(...types.map(type => type.length));
const noConsoleTypes = [];

const requestIdLength = 36;

const report = function (logger, loggerLevel, level, rawMessage, logObj = {}) {
  const info = Object.assign({}, logObj);
  const {
    type = 'generic',
    requestInfo = {},
  } = logObj;
  const { requestId } = requestInfo;
  const timestamp = requestInfo.timestamp || (new Date()).toISOString();
  requestInfo.timestamp = timestamp;

  const message = getMessage({ rawMessage, type, level, timestamp, requestId });

  Object.assign(info, { type, level, message });

  if (logger) {
    logger(info);
  }

  consolePrint({ type, level, message, loggerLevel });
};

const getMessage = function ({
  rawMessage,
  type,
  level,
  timestamp,
  requestId = '',
}) {
  const logType = type.toUpperCase().padEnd(typesMaxLength);
  const logLevel = level.toUpperCase().padEnd(levelsMaxLength);
  const logRequestId = requestId.padEnd(requestIdLength);

  const message = `[${logType}] [${logLevel}] [${timestamp}] [${logRequestId}] ${rawMessage}`;

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
