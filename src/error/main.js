'use strict';

const { difference } = require('lodash');

// Note that any exception thrown in the `error` module might not create an
// event (since this is the error), so we must be precautious.
const createError = function (message, stack, opts = {}) {
  validateError(opts);

  const innererror = getInnerError({ opts, stack });
  const type = errorType;

  return { ...opts, message, stack, innererror, type };
};

const errorType = Symbol('error');

// Make sure signature is correct
const validateError = function (opts) {
  // Check whitelisted options
  const optsKeys = Object.keys(opts);
  const nonAllowedOpts = difference(optsKeys, allowedOpts);

  if (nonAllowedOpts.length > 0) {
    const message = `Cannot use options '${nonAllowedOpts}' when throwing an error`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

const allowedOpts = ['reason', 'innererror', 'extra'];

// Keep track of innererror
const getInnerError = function ({ opts, stack: upperStack }) {
  // Only keep innermost innererror
  const innererror = opts.innererror && opts.innererror.innererror
    ? opts.innererror.innererror
    : opts.innererror;
  if (!innererror) { return; }

  // eslint-disable-next-line fp/no-mutation
  innererror.stack = getInnerErrorStack({ innererror, upperStack });

  return innererror;
};

const getInnerErrorStack = function ({
  innererror: { message, stack = '' },
  upperStack,
}) {
  // Node core errors include a `stack` property, but it actually does not
  // have any stack, and just repeats the `message`. We don't want this.
  if (!(/\n/).test(stack)) { return `${stack}\n${upperStack}`; }

  // We only keep innererror's stack, so if it does not include the
  // error message, which might be valuable information, prepends it
  if (message && stack.indexOf(message) === -1) {
    return `${message}\n${stack}`;
  }

  return stack;
};

const isError = function ({ error }) {
  return error && error.type === errorType;
};

const throwError = function (message, opts) {
  const stack = message.stack || getStack({ caller: throwError });
  const error = createError(message, stack, opts);
  // eslint-disable-next-line fp/no-throw
  throw error;
};

const rethrowError = function (error) {
  // eslint-disable-next-line fp/no-throw
  throw error;
};

// External dependencies might throw errors that are not instances of
// our types of error, so we want to fix those.
const normalizeError = function ({ error, message, reason = 'UNKNOWN' }) {
  if (isError({ error })) { return error; }

  const errorMessage = getErrorMessage({ error, message });
  const stack = (error && error.stack) || getStack({ caller: normalizeError });
  return createError(errorMessage, stack, { reason });
};

const getErrorMessage = function ({ error, message }) {
  if (message) { return message; }
  if (typeof error === 'string') { return error; }
  return '';
};

const getStack = function ({ caller } = {}) {
  const stackObj = {};
  Error.captureStackTrace(stackObj, caller);
  return stackObj.stack;
};

module.exports = {
  throwError,
  rethrowError,
  normalizeError,
};
