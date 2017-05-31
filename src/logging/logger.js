'use strict';


const { magenta, green, yellow, red, dim } = require('chalk');


const levels = ['info', 'log', 'warn', 'error'];
const levelsMaxLength = Math.max(...levels.map(level => level.length));
const colors = {
  info: magenta,
  log: green,
  warn: yellow,
  error: red,
};

const types = ['generic', 'startup', 'failure', 'request'];
const typesMaxLength = Math.max(...types.map(type => type.length));
const consoleTypes = ['generic', 'startup', 'failure', 'request'];

const requestIdLength = 36;

const getLog = function ({ logger }) {
  return levels.reduce((newLog, level) => {
    const levelLog = getLevelLog.bind(null, logger, level);
    return Object.assign(newLog, { [level]: levelLog });
  }, {});
};

const getLevelLog = function (logger, level, rawMessage, logObj = {}) {
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

  const shouldConsolePrint = consoleTypes.includes(type);
  if (shouldConsolePrint) {
    global.console[level](message);
  }
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

const colorize = function (level, message) {
  const [, first, second, third, , fourth = ''] = messageRegExp.test(message)
    ? messageRegExp.exec(message)
    : shortMessageRexExp.exec(message);

  const colorMessage = [
    colors[level].bold(first),
    colors[level](second),
    third,
    dim(fourth),
  ].join(' ');

  return colorMessage;
};

// Look for [...] [...] [...] [...] ... - ...
const messageRegExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\]) ((.|\n|\r)*) (- (.|\n|\r)*)/;
// Look for [...] [...] [...] [...] ...
const shortMessageRexExp = /^(\[[^\]]*\] \[[^\]]*\]) (\[[^\]]*\] \[[^\]]*\]) ((.|\n|\r)*)/;


module.exports = {
  getLog,
};
