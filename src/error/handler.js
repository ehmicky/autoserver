'use strict';

const { keepFuncName } = require('../utilities');

const { throwError } = require('./main');

// Wrap a function with a error handler
const addErrorHandler = function (func, errorHandler) {
  const isAsync = func[Symbol.toStringTag] === 'AsyncFunction';
  const wrapperFunc = isAsync ? errorAsyncHandledFunc : errorHandledFunc;
  return wrapperFunc.bind(null, func, errorHandler);
};

const kAddErrorHandler = keepFuncName(addErrorHandler);

const errorHandledFunc = function (func, errorHandler, ...args) {
  try {
    return func(...args);
  } catch (error) {
    return errorHandler(error, ...args);
  }
};

const errorAsyncHandledFunc = async function (func, errorHandler, ...args) {
  try {
    return await func(...args);
  } catch (error) {
    return errorHandler(error, ...args);
  }
};

// Use `addErrorHandler()` with a generic error handler that rethrows
const addGenErrorHandler = function (func, { message, reason }) {
  const errorHandler = genErrorHandler.bind(null, { message, reason });
  return kAddErrorHandler(func, errorHandler);
};

const genErrorHandler = function ({ message, reason }, error, ...args) {
  const messageA = typeof message === 'function' ? message(...args) : message;
  throwError(messageA, { reason, innererror: error });
};

module.exports = {
  addErrorHandler: kAddErrorHandler,
  addGenErrorHandler,
};
