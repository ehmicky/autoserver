'use strict';

const { pickBy, mapValues } = require('../../utilities');
const { addErrorHandler, throwError, normalizeError } = require('../../error');

// Wrap all `patchOp.check|apply()` functions with an error handler in case
// they throw an exception, which would indicate a server-side bug
const addAllErrorHandlers = function ({ operators }) {
  return mapValues(
    operators,
    (operator, type) => addErrorHandlers({ operator, type }),
  );
};

const addErrorHandlers = function ({ operator, type }) {
  const operatorA = pickBy(operator, shouldBeHandled);
  const operatorB = mapValues(
    operatorA,
    (func, funcName) => addHandler({ type, func, funcName }),
  );
  const operatorC = { ...operator, ...operatorB };
  return operatorC;
};

const shouldBeHandled = function (func, funcName) {
  return HANDLED_FUNCS.includes(funcName) && func !== undefined;
};

const HANDLED_FUNCS = ['check', 'apply'];

const addHandler = function ({ type, func, funcName }) {
  const errorHandlerA = errorHandler.bind(null, { type, funcName });
  const funcA = addErrorHandler(func, errorHandlerA);
  return funcA;
};

const errorHandler = function ({ type, funcName }, error) {
  const innererror = normalizeError({ error });
  const message = `Patch operator '${type}' ${funcName}() function threw an error: ${innererror.message}`;
  throwError(message, { reason: 'UTILITY_ERROR', innererror });
};

module.exports = {
  addAllErrorHandlers,
};
