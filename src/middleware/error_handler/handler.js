'use strict';


const { LogInfo, infoSym } = require('../../logging');
const { getStandardError } = require('./standard');
const { handleFailure } = require('./failure');
const { getResponse } = require('./response');
const { reportError } = require('./report');


// Error handler, which sends final response, if errors
const errorHandler = function () {
  return async function errorHandler(specific) {
    const logInfo = new LogInfo();
    const input = { specific, logInfo };

    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        const info = logInfo[infoSym] || {};
        handleError({ error, info });
      // If error handler itself fails
      } catch (innererror) {
        handleFailure({ error: innererror });
      }
    }
  };
};

const handleError = function ({ error, info }) {
  const standardError = getStandardError({ error, info });

  const errorResponse = getResponse({ error: standardError });

  reportError({ error: standardError });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    error.sendError(errorResponse);
  }
};


module.exports = {
  errorHandler,
};
