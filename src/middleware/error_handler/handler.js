'use strict';


const { LogInfo } = require('../../logging');
const { processError } = require('./process');
const { handleFailure } = require('./failure');
const { getResponse } = require('./response');
const { reportError } = require('./report');


// Error handler, which sends final response, if errors
const errorHandler = function (opts) {
  return async function errorHandler(specific) {
    const logInfo = new LogInfo();
    const input = { specific, logInfo };

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

  const { errorObj, transformedResponse } = getResponse({ error });

  reportError({ errorObj, opts });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    error.sendError(transformedResponse);
  }
};


module.exports = {
  errorHandler,
};
