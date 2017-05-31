'use strict';


const { Log, infoSym } = require('../../logging');
const { handleError } = require('./error');
const { handleFailure } = require('./failure');


// Error handler, which sends final response, if errors
const errorHandler = function ({ logger, loggerLevel }) {
  return async function errorHandler(specific) {
    const log = new Log({ logger, loggerLevel, type: 'request' });
    const input = { specific, log };

    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        const info = log[infoSym] || {};
        handleError({ log, error, info });
      // If error handler itself fails
      } catch (innererror) {
        handleFailure({ log, error: innererror });
      }
    }
  };
};


module.exports = {
  errorHandler,
};
