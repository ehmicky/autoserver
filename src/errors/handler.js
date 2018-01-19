'use strict';

const { keepFuncName, result } = require('../utilities');

const { throwError, normalizeError } = require('./main');
const { throwPb } = require('./props');

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
const addErrorHandler = function (func, errorHandler = () => undefined) {
  return errorHandledFunc.bind(null, func, errorHandler);
};

const kAddErrorHandler = keepFuncName(addErrorHandler);

const errorHandledFunc = function (func, errorHandler, ...args) {
  try {
    const retVal = func(...args);

    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => errorHandler(error, ...args))
      : retVal;
  } catch (error) {
    return errorHandler(error, ...args);
  }
};

// Use `addErrorHandler()` with a generic error handler that rethrows
const addGenErrorHandler = function (func, { message, reason, extra }) {
  const errorHandler = genErrorHandler.bind(null, { message, reason, extra });
  return kAddErrorHandler(func, errorHandler);
};

const genErrorHandler = function ({ message, reason, extra }, error, ...args) {
  const innererror = normalizeError({ error });
  const messageA = result(message, ...args, innererror) || innererror.message;
  const reasonA = result(reason, ...args, innererror) || innererror.reason;
  const extraA = result(extra, ...args, innererror) || innererror.extra;
  throwError(messageA, { reason: reasonA, innererror, extra: extraA });
};

const addGenPbHandler = function (func, { message, reason, extra }) {
  const errorHandler = genPbHandler.bind(null, { message, reason, extra });
  return kAddErrorHandler(func, errorHandler);
};

const genPbHandler = function ({ message, reason, extra }, error, ...args) {
  const innererror = normalizeError({ error });
  const messageA = result(message, ...args, innererror) || innererror.message;
  const reasonA = result(reason, ...args, innererror) || innererror.reason;
  const extraA = result(extra, ...args, innererror) || innererror.extra;
  throwPb({ reason: reasonA, message: messageA, innererror, ...extraA });
};

const changeErrorReason = function (func, reason) {
  return addGenErrorHandler(func, { reason: getReason.bind(null, reason) });
};

const getReason = function (reason, input, { reason: errorReason }) {
  if (errorReason && errorReason !== 'UNKNOWN') { return errorReason; }

  return reason;
};

module.exports = {
  addErrorHandler: kAddErrorHandler,
  addGenErrorHandler,
  addGenPbHandler,
  changeErrorReason,
};
