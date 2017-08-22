'use strict';

const { pSetTimeout } = require('../../../utilities');
const { getStandardError } = require('../../../error');

const { sendErrorResponse } = require('./response');
const { reportError } = require('./report');

// Error handler, which sends final response, if errors
const errorHandler = async function (nextFunc, input) {
  try {
    return await nextFunc(input);
  } catch (error) {
    return errorHandle({ input, error });
  }
};

const errorHandle = async function ({
  input,
  input: {
    reqInfo,
    protocolHandler,
    protocolHandler: { failureProtocolStatus: status },
    specific,
  },
  error,
}) {
  // When an exception is thrown in the same macrotask as the one that started
  // the request (e.g. in one of the first middleware), the socket won't be
  // closed even after sending back the error response.
  // Since the socket won't be closed, closing the server will hang.
  // This is unclear why, but doing this solves the problem.
  await pSetTimeout(0);

  const standardError = getStandardError({ reqInfo, error });

  await reportError({ input, error: standardError });

  await sendErrorResponse({ error, standardError });

  // Make sure a response is sent, or the socket will hang
  protocolHandler.send.nothing({ specific, status });

  return standardError;
};

module.exports = {
  errorHandler,
};
