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
