'use strict';


const { deepMerge } = require('../utilities');
const { report } = require('./logger');
const { getRequestInfo } = require('./request_info');
const { getRequestMessage } = require('./request_message');


// We use symbols to make those members private
const infoSym = Symbol('info');
const reportSym = Symbol('report');

class LogInfo {

  constructor({ logger, loggerLevel, type }) {
    this[infoSym] = {};
    Object.assign(this, { logger, loggerLevel, type });
  }

  add(obj) {
    this[infoSym] = deepMerge(this[infoSym], obj);
  }

  info(...args) {
    this[reportSym]('info', ...args);
  }

  log(...args) {
    this[reportSym]('log', ...args);
  }

  warn(...args) {
    this[reportSym]('warn', ...args);
  }

  error(...args) {
    this[reportSym]('error', ...args);
  }

  [reportSym](level, rawMessage, logObj = {}){
    if (this.type === 'request') {
      logObj.requestInfo = getRequestInfo(this[infoSym]);
      if (logObj.type === 'request') {
        rawMessage = getRequestMessage(logObj.requestInfo);
      }
    }

    report(this.logger, this.loggerLevel, level, rawMessage, logObj);
  }

}


module.exports = {
  LogInfo,
  infoSym,
};
