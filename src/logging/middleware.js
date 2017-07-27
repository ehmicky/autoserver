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

    const newLog = response.log || input.log;
    const nextResponse = Object.assign({}, response, { log: newLog });

    return nextResponse;
  } catch (error) {
    const errorObj = normalizeError({ error });
    const newLog = errorObj.log || input.log;
    const newError = Object.assign({}, errorObj, { log: newLog });
    rethrowError(newError);
  }
};

module.exports = {
  getMiddlewareLogging,
};
