'use strict';

const { keepFuncName } = require('../utilities');

const { throwError } = require('./main');

// Wrap a function with a error handler
const addErrorHandler = function (func, { message, reason }) {
  const isAsync = func[Symbol.toStringTag] === 'AsyncFunction';
  const wrapperFunc = isAsync ? errorAsyncHandledFunc : errorHandledFunc;
  return wrapperFunc.bind(null, { func, message, reason });
};

const errorHandledFunc = function ({ func, message, reason }, ...args) {
  try {
    return func(...args);
  } catch (error) {
    handleError({ message, reason, error }, ...args);
  }
};

const errorAsyncHandledFunc = async function (
  { func, message, reason },
  ...args
) {
  try {
    return await func(...args);
  } catch (error) {
    handleError({ message, reason, error }, ...args);
  }
};

const handleError = function ({ message, reason, error }, ...args) {
  const messageA = typeof message === 'function' ? message(...args) : message;
  throwError(messageA, { reason, innererror: error });
};

const kAddErrorHandler = keepFuncName(addErrorHandler);

module.exports = {
  addErrorHandler: kAddErrorHandler,
};
