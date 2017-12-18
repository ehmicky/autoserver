'use strict';

const { difference } = require('../utilities');

// Note that any exception thrown in the `error` module might not create an
// event (since this is the error), so we must be precautious.
const createError = function (message, stack, opts = {}) {
  validateError(opts);

  const innererror = getInnerError({ opts, stack });
  const type = ERROR_TYPE;

  const error = new Error(message);
  // This is the only way to keep it an instanceof Error
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, { ...opts, stack, innererror, type });

  return error;
};

const ERROR_TYPE = Symbol('error');

// Make sure signature is correct
const validateError = function (opts) {
  // Check whitelisted options
  const optsKeys = Object.keys(opts);
  const nonAllowedOpts = difference(optsKeys, ALLOWED_OPTS);

  if (nonAllowedOpts.length === 0) { return; }

  const message = `Cannot use options '${nonAllowedOpts}' when throwing an error`;
  throwError(message, { reason: 'UTILITY' });
};

const ALLOWED_OPTS = ['reason', 'innererror', 'extra'];

// Keep track of innererror
const getInnerError = function ({ opts, stack: upperStack }) {
  const shallowInnerError = opts.innererror;
  const deepInnerError = shallowInnerError && shallowInnerError.innererror;

  // Keep innermost innererror stack
  const innererror = deepInnerError || shallowInnerError;
  if (!innererror) { return; }

  const innererrorStack = getInnerErrorStack({ innererror, upperStack });
  // Innermost innererror stack is kept, but outermost innererror message and
  // reason are kept as well.
  const shallowInnerErrorMessage = deepInnerError
    ? `${shallowInnerError.reason} - ${shallowInnerError.message}\n`
    : '';
  // eslint-disable-next-line fp/no-mutation
  innererror.stack = `${shallowInnerErrorMessage}${innererrorStack}`;

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
  return error && error.type === ERROR_TYPE;
};

const throwError = function (message = MISSING_MESSAGE, opts) {
  const stack = message.stack || getStack({ caller: throwError });
  const error = createError(message, stack, opts);
  // eslint-disable-next-line fp/no-throw
  throw error;
};

const MISSING_MESSAGE = 'Missing error message';

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
  if (error.message) { return error.message; }
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
  isError,
};
