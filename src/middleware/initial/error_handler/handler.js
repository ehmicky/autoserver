'use strict';

const { pSetTimeout } = require('../../../utilities');

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
  input,
  input: { protocolHandler, specific },
  error: errorA,
}) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  const status = protocolHandler.failureProtocolStatus;

  try {
    const response = await handleError({ input, error: errorA });

    // Make sure a response is sent, or the socket will hang
    protocolHandler.send.nothing({ specific, status });

    return response;
  // If error handler itself fails
  } catch (error) {
    const response = handleFailure({ input, error });

    protocolHandler.send.nothing({ specific, status });

    return response;
  }
};

module.exports = {
  errorHandler,
};
