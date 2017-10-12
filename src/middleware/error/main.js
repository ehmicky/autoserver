'use strict';

const {
  rethrowError,
  normalizeError,
  addErrorHandler,
} = require('../../error');
const { omit } = require('../../utilities');

const { errorHandler } = require('./error_handler');
const { failureHandler } = require('./failure_handler');

// Middleware function error handler, which just rethrow the error,
// and adds the current `mInput` as information by setting `error.mInput`
const fireMiddlewareHandler = function (error, ...args) {
  // Skip `nextLayer` and `reqState` arguments
  const errorA = error.mInput ? error : addMInput(error, args[2]);
  rethrowError(errorA);
};

// Main layers error handler
const fireMainLayersHandler = async function (
  fireLayer,
  error,
  { allLayers, reqState },
) {
  const mInputA = getErrorMInput({ error });

  // Final layer are called before error handlers, except if the error
  // was raised by the final layer itself
  const mInputB = await fireLayer(allLayers, reqState, mInputA);

  addMInput(error, mInputB);

  rethrowError(error);
};

// Fire request error handlers
const fireErrorHandler = function (errorA) {
  const mInputA = getErrorMInput({ error: errorA });
  return errorHandler(mInputA);
};

const fireFailureHandler = function (errorA) {
  const mInputA = getErrorMInput({ error: errorA });
  return failureHandler(mInputA);
};

// Request error handlers might fail themselves
const handlerHandler = function (error, errorA) {
  addMInput(error, errorA.mInput);

  rethrowError(error);
};

const eFireErrorHandler = addErrorHandler(fireErrorHandler, handlerHandler);
const eFireFailureHandler = addErrorHandler(fireFailureHandler, handlerHandler);

// Add `error.mInput`, to keep track of current `mInput` during exception flow
const addMInput = function (error, mInput) {
  const mInputA = omit(mInput, 'error');
  // We need to directly mutate to keep Error constructor
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { mInput: mInputA });

  return error;
};

// Builds `mInput` with a `mInput.error` property
const getErrorMInput = function ({ error, error: { mInput = {} } }) {
  const errorA = normalizeError({ error });
  // We need to directly mutate to keep Error constructor
  // eslint-disable-next-line fp/no-delete
  delete errorA.mInput;

  return { ...mInput, mInput, error: errorA };
};

module.exports = {
  fireMiddlewareHandler,
  fireMainLayersHandler,
  fireErrorHandler: eFireErrorHandler,
  fireFailureHandler: eFireFailureHandler,
  getErrorMInput,
  addMInput,
};
