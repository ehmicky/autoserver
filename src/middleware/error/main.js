'use strict';

const { rethrowError, normalizeError } = require('../../error');

const { errorHandler } = require('./error_handler');
const { failureHandler } = require('./failure_handler');

// Add request error handlers
const addLayersErrorsHandlers = function (func) {
  const funcA = errorHandledFunc.bind(null, func, errorHandler);
  const funcB = errorHandledFunc.bind(null, funcA, failureHandler);
  return funcB;
};

const errorHandledFunc = async function (func, handler, ...args) {
  try {
    return await func(...args);
  } catch (error) {
    await fireErrorHandler(handler, error);
  }
};

// Fire request error handlers
const fireErrorHandler = async function (handler, errorA) {
  const input = getErrorInput({ error: errorA });

  try {
    await handler(input);
  // Request error handlers might fail themselves
  } catch (error) {
    throwMiddlewareError(error, input);
  }
};

// Extract `input` from `error.input`
const getErrorInput = function ({ error, error: { input = {} } }) {
  const errorA = normalizeError({ error });
  return { ...input, error: errorA };
};

const throwMiddlewareError = function (error, input) {
  if (!error.input) {
    // Must directly assign to error, because { ...error } does not work
    // eslint-disable-next-line fp/no-mutating-assign
    Object.assign(error, { input });
  }

  rethrowError(error);
};

// Middleware function error handler, which just rethrow the error,
// and adds the current `input` as information by setting `error.input`
const addMiddlewareHandler = function (func, nextLayer, ...args) {
  try {
    const maybePromise = func(nextLayer, ...args);

    // Middleware functions can be sync or async
    // We want to avoid async|await in order not to create promises
    // when the middleware is sync, for performance reason
    // eslint-disable-next-line promise/prefer-await-to-then
    return typeof maybePromise.then === 'function'
      ? maybePromise.catch(error => throwMiddlewareError(error, ...args))
      : maybePromise;
  } catch (error) {
    throwMiddlewareError(error, ...args);
  }
};

module.exports = {
  addLayersErrorsHandlers,
  getErrorInput,
  addMiddlewareHandler,
};
