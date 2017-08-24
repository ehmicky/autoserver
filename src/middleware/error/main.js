'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { promiseCatch } = require('../../utilities');

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
  const mInput = getErrorMInput({ error: errorA });

  try {
    await handler(mInput);
  // Request error handlers might fail themselves
  } catch (error) {
    throwMiddlewareError(error, mInput);
  }
};

// Extract `mInput` from `error.mInput`
const getErrorMInput = function ({ error, error: { mInput = {} } }) {
  const errorA = normalizeError({ error });
  return { ...mInput, mInput, error: errorA };
};

const throwMiddlewareError = function (error, mInput, { force = false } = {}) {
  if (!error.mInput || force) {
    // Must directly assign to error, because { ...error } does not work
    // eslint-disable-next-line fp/no-mutating-assign
    Object.assign(error, { mInput });
  }

  rethrowError(error);
};

// Middleware function error handler, which just rethrow the error,
// and adds the current `mInput` as information by setting `error.mInput`
const addMiddlewareHandler = function (func, nextLayer, ...args) {
  const funcA = promiseCatch(func.bind(null, nextLayer), throwMiddlewareError);
  return funcA(...args);
};

module.exports = {
  addLayersErrorsHandlers,
  addMiddlewareHandler,
  getErrorMInput,
  throwMiddlewareError,
};
