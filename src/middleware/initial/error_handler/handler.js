'use strict';


const { handleError } = require('./error');
const { handleFailure } = require('./failure');


// Error handler, which sends final response, if errors
const errorHandler = function () {
  return async function errorHandler(input) {
    const { log } = input;

    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        const perf = log.perf.start('errorHandler', 'exception');
        await handleError({ log, error });
        perf.stop();
      // If error handler itself fails
      } catch (innererror) {
        await handleFailure({ log, error: innererror });
      }
    }
  };
};


module.exports = {
  errorHandler,
};
