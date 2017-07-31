'use strict';

const { normalizeError, rethrowError } = require('../error');

// Generic middleware that performs performance logging before each middleware
const getMiddlewareLogging = () => async function middlewareLogging (
  nextFunc,
  input,
  ...args
) {
  // When an exception is thrown, unless a state variable is used like
  // `logRef`, the current `response.log` information will be lost.
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  input.logRef = input.logRef || {};

  try {
    const response = await nextFunc(input, ...args) || {};

    const log = response.log || input.log;
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    input.logRef.log = log;
    const responseA = { ...response, log };

    return responseA;
  } catch (error) {
    handleError({ input, error });
  }
};

const handleError = function ({ input, input: { logRef }, error }) {
  const errorA = normalizeError({ error });
  const log = errorA.log || logRef.log || input.log;
  const errorB = { ...errorA, log };
  rethrowError(errorB);
};

module.exports = {
  getMiddlewareLogging,
};
