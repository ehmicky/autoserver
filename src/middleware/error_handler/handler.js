'use strict';


const { Log } = require('../../logging');
const { handleError } = require('./error');
const { handleFailure } = require('./failure');


// Error handler, which sends final response, if errors
const errorHandler = function (opts) {
  return async function errorHandler(specific) {
    const log = new Log({ opts, phase: 'request' });
    const input = { specific, log };

    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        handleError({ log, error });
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
