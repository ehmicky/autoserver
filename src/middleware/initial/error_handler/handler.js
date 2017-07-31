'use strict';

const { handleError } = require('./error');
const { handleFailure } = require('./failure');

// Error handler, which sends final response, if errors
const errorHandler = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);
    return response;
  } catch (error) {
    const response = await errorHandle({ input, error });
    return response;
  }
};

const errorHandle = async function ({
  input: { protocolHandler, specific },
  error: errorA,
  error: { log },
}) {
  const status = protocolHandler.failureProtocolStatus;

  try {
    const response = await handleError({ log, error: errorA });

    // Make sure a response is sent, or the socket will hang
    protocolHandler.send.nothing({ specific, status });

    return response;
  // If error handler itself fails
  } catch (error) {
    const response = handleFailure({ log, error });

    protocolHandler.send.nothing({ specific, status });

    return response;
  }
};

module.exports = {
  errorHandler,
};
