'use strict';


const { processError } = require('./process');
const { handleFailure } = require('./failure');
const { getResponse } = require('./response');
const { reportError } = require('./report');


// Error handler, which sends final response, if errors
const errorHandler = function (opts) {
  return async function errorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        handleError({ error, opts });
      // If error handler itself fails
      } catch (innererror) {
        handleFailure({ error, innererror, opts });
      }
    }
  };
};

const handleError = function ({ error, opts }) {
  error = processError({ error });

  const response = getResponse({ error });

  reportError({ response, opts });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    error.sendError(response);
  }
};


module.exports = {
  errorHandler,
};
