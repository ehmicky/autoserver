'use strict';


const { getMessage } = require('./message');
const { colorize } = require('./colorize');
const { consolePrint } = require('./console');


const report = function (logger, loggerLevel, level, rawMessage, logObj) {
  const {
    type,
    requestInfo: {
      // Used in message prefix
      requestId,
      // Reuse the request timestamp if possible
      timestamp = (new Date()).toISOString(),
    } = {},
    phase,
  } = logObj;

  const message = getMessage({
    phase,
    type,
    level,
    timestamp,
    requestId,
    rawMessage,
  });
  const colorMessage = colorize({ type, level, message });

  if (logger) {
    const info = Object.assign({}, logObj, { timestamp, type, level, message });
    logger(info);
  }

  consolePrint({ type, level, message: colorMessage, loggerLevel });
};


module.exports = {
  report,
};
