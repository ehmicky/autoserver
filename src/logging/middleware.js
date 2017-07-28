'use strict';

const { normalizeError, rethrowError } = require('../error');

// Generic middleware that performs performance logging before each middleware
const getMiddlewareLogging = () => async function middlewareLogging (
  nextFunc,
  input,
  ...args
) {
  try {
    const response = await nextFunc(input, ...args) || {};

    const log = response.log || input.log;
    const responseA = { ...response, log };

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });
    const log = errorA.log || input.log;
    const errorB = { ...errorA, log };
    rethrowError(errorB);
  }
};

module.exports = {
  getMiddlewareLogging,
};
