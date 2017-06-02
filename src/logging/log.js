'use strict';


const { deepMerge, buffer } = require('../utilities');
const { EngineError } = require('../error');
const { report } = require('./logger');
const { getRequestInfo } = require('./request_info');
const { getRequestMessage } = require('./request_message');
const { LEVELS } = require('./constants');


class Log {

  constructor({ opts: { logger, loggerLevel, loggerFilter }, phase }) {
    this._info = {};

    this._report = buffer(this._report, this);

    for (const level of LEVELS) {
      this[level] = this._report.bind(this, level);
    }

    Object.assign(this, { logger, loggerLevel, loggerFilter, phase });
  }

  add(obj) {
    this._info = deepMerge(this._info, obj);
  }

  _report(level, rawMessage = '', logObj = {}){
    if (typeof rawMessage !== 'string') {
      const message = `Message must be a string: '${rawMessage}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }
    if (logObj == null || logObj.constructor !== Object) {
      const message = `Log object must be an object: '${JSON.stringify(logObj)}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    const phase = this.phase;
    const type = logObj.type || 'message';
    Object.assign(logObj, { phase, type });

    if (phase === 'request') {
      logObj.requestInfo = getRequestInfo(this._info, this.loggerFilter);
      if (type === 'call') {
        rawMessage = getRequestMessage(logObj.requestInfo);
      }
    }

    report(this.logger, this.loggerLevel, level, rawMessage, logObj);
  }

  // Buffer log calls
  // E.g. used in requests when requestInfo is not completely built yet
  _setBuffered(isBuffered) {
    const method = isBuffered ? 'cork' : 'uncork';
    this._report[method]();
  }

}


module.exports = {
  Log,
};
