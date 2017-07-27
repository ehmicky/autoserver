'use strict';

const { handleError } = require('./error');
const { handleFailure } = require('./failure');

// Error handler, which sends final response, if errors
const errorHandler = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);
    return response;
  } catch (error) {
    const { protocolHandler, specific } = input;
    const { log } = error;

    try {
      await handleError({ log, error });
    // If error handler itself fails
    } catch (innererror) {
      await handleFailure({ log, error: innererror });
    // Make sure a response is sent, or the socket will hang
    } finally {
      const status = protocolHandler.failureProtocolStatus;
      await protocolHandler.send.nothing({ specific, status });
    }
  }
};

module.exports = {
  errorHandler,
};
