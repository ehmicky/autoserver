'use strict';

const { difference } = require('lodash');

// Note that any exception thrown in the `error` module might not be logged
// (since this is the error), so we must be precautious.
const createError = function (message, stack, opts = {}) {
  validateError(opts);

  const innererror = getInnerError(opts);
  const type = errorType;

  const error = Object.assign({ message, stack, innererror, type }, opts);
  return error;
};

const errorType = Symbol('error');

// Make sure signature is correct
const validateError = function (opts) {
  // Check whitelisted options
  const optsKeys = Object.keys(opts);
  const nonAllowedOpts = difference(optsKeys, allowedOpts);

  if (nonAllowedOpts.length > 0) {
    const message = `Cannot use options ${nonAllowedOpts} when throwing an error`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

const allowedOpts = ['reason', 'innererror', 'extra'];

// Keep track of innererror
const getInnerError = function (opts) {
  // Only keep innermost innererror
  const innererror = opts.innererror && opts.innererror.innererror
    ? opts.innererror.innererror
    : opts.innererror;
  if (!innererror) { return; }

  // We only keep innererror's stack, so if it does not include the
  // error message, which might be valuable information, prepends it
  const { message, stack = '' } = innererror;

  if (message && stack.indexOf(message) === -1) {
    innererror.stack = `${message}\n${stack}`;
  }

  return innererror;
};

const isError = function ({ error }) {
  return error && error.type === errorType;
};

const throwError = function (message, opts) {
  // eslint-disable-next-line fp/no-throw
  if (isError({ error: message })) { throw message; }

  const stack = message.stack || getStack({ caller: throwError });
  const error = createError(message, stack, opts);
  // eslint-disable-next-line fp/no-throw
  throw error;
};

// External dependencies might throw errors that are not instances of
// our types of error, so we want to fix those.
const normalizeError = function ({ error, message, reason = 'UNKNOWN' }) {
  if (isError({ error })) { return error; }

  const errorMessage = message || (typeof error === 'string' ? error : '');
  const stack = error.stack || getStack({ caller: normalizeError });
  return createError(errorMessage, stack, { reason });
};

const getStack = function ({ caller } = {}) {
  const stackObj = {};
  Error.captureStackTrace(stackObj, caller);
  return stackObj.stack;
};

module.exports = {
  throwError,
  normalizeError,
};
