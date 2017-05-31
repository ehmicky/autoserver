'use strict';


const { LogInfo, infoSym } = require('../../logging');
const { handleError } = require('./error');
const { handleFailure } = require('./failure');


// Error handler, which sends final response, if errors
const errorHandler = function ({ logger }) {
  return async function errorHandler(specific) {
    const logInfo = new LogInfo({ logger, type: 'request' });
    const input = { specific, logInfo };

    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      try {
        const info = logInfo[infoSym] || {};
        handleError({ logInfo, error, info });
      // If error handler itself fails
      } catch (innererror) {
        handleFailure({ logInfo, error: innererror });
      }
    }
  };
};


module.exports = {
  errorHandler,
};
