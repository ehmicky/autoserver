'use strict';


const { deepMerge, buffer } = require('../utilities');
const { EngineError } = require('../error');
const { report } = require('./logger');
const { getRequestInfo } = require('./request_info');
const { getRequestMessage } = require('./request_message');


// We use symbols to make those members private
const reportSym = Symbol('report');

class Log {

  constructor({ opts: { logger, loggerLevel, loggerFilter }, phase }) {
    this._info = {};

    this[reportSym] = buffer(this[reportSym], this);

    Object.assign(this, { logger, loggerLevel, loggerFilter, phase });
  }

  add(obj) {
    this._info = deepMerge(this._info, obj);
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

  [reportSym](level, rawMessage = '', logObj = {}){
    if (typeof rawMessage !== 'string') {
      const message = `Message must be a string: '${rawMessage}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }
    if (logObj == null || logObj.constructor !== Object) {
      const message = `Log object must be an object: '${JSON.stringify(logObj)}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    if (this.phase === 'request') {
      logObj.requestInfo = getRequestInfo(this._info, this.loggerFilter);
      if (logObj.type === 'call') {
        rawMessage = getRequestMessage(logObj.requestInfo);
      }
    }

    logObj.phase = this.phase;

    report(this.logger, this.loggerLevel, level, rawMessage, logObj);
  }

  // Buffer log calls
  // E.g. used in requests when requestInfo is not completely built yet
  _setBuffered(isBuffered) {
    const method = isBuffered ? 'cork' : 'uncork';
    this[reportSym][method]();
  }

}


module.exports = {
  Log,
};
