'use strict';


const { getMessage } = require('./message');
const { consolePrint } = require('./console');


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

  const message = getMessage({ type, level, timestamp, requestId, rawMessage });

  if (logger) {
    const info = Object.assign({}, logObj, { timestamp, type, level, message });
    logger(info);
  }

  consolePrint({ type, level, message, loggerLevel });
};


module.exports = {
  report,
};
