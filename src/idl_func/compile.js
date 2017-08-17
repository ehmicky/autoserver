'use strict';

const { throwError } = require('../error');
const { setAll } = require('../utilities');

const { getParamsKeys } = require('./params');
const { isInlineFunc, isEscapedInlineFunc } = require('./test');
const { getInlineFunc } = require('./tokenize');

// Compile all IDL functions, i.e. apply `new Function()`
const compileIdlFuncs = function ({ idl, idl: { inlineFuncPaths } }) {
  const paramsKeys = getParamsKeys({ idl });

  return setAll(
    idl,
    inlineFuncPaths,
    inlineFunc => compileIdlFunc({ inlineFunc, paramsKeys }),
  );
};

// Transform inline functions into a function with the inline function as body
// Returns if it is not inline function
// This can throw if inline function's JavaScript is wrong
const compileIdlFunc = function ({ inlineFunc, paramsKeys }) {
  // If this is not inline function, abort
  if (!isInlineFunc({ inlineFunc })) {
    return getNonInlineFunc({ inlineFunc });
  }

  const inlineFuncA = getInlineFunc({ inlineFunc });

  return eCreateFunction({ inlineFunc: inlineFuncA, paramsKeys });
};

const getNonInlineFunc = function ({ inlineFunc }) {
  // Can escape (...) from being interpreted as inline function by escaping
  // first parenthesis
  if (isEscapedInlineFunc({ inlineFunc })) {
    return inlineFunc.replace('\\', '');
  }

  return inlineFunc;
};

const createFunction = function ({ inlineFunc, paramsKeys }) {
  // Create a function with the inline function as body
  // eslint-disable-next-line no-new-func
  const func = new Function(`{ ${paramsKeys} }`, `return ${inlineFunc};`);
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(func, { inlineFunc });

  return func;
};

const addErrorHandler = function (func) {
  return (obj, ...args) => {
    try {
      return func(obj, ...args);
    } catch (error) {
      const { inlineFunc } = obj;
      const message = `Invalid IDL function: '${inlineFunc}'`;
      throwError(message, { reason: 'IDL_VALIDATION', innererror: error });
    }
  };
};

const eCreateFunction = addErrorHandler(createFunction);

module.exports = {
  compileIdlFuncs,
};
