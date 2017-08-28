'use strict';

const { addErrorHandler } = require('../error');
const { setAll } = require('../utilities');

const { getVarsKeys } = require('./variables');
const { isInlineFunc, isEscapedInlineFunc } = require('./test');
const { getInlineFunc } = require('./tokenize');

// Compile all IDL functions, i.e. apply `new Function()`
const compileIdlFuncs = function ({ idl, idl: { inlineFuncPaths } }) {
  const varsKeys = getVarsKeys({ idl });

  const idlA = setAll(
    idl,
    inlineFuncPaths,
    inlineFunc => compileIdlFunc({ inlineFunc, varsKeys }),
  );
  return { idl: idlA };
};

// Transform inline functions into a function with the inline function as body
// Returns if it is not inline function
// This can throw if inline function's JavaScript is wrong
const compileIdlFunc = function ({ inlineFunc, varsKeys }) {
  // If this is not inline function, abort
  if (!isInlineFunc({ inlineFunc })) {
    return getNonInlineFunc({ inlineFunc });
  }

  const inlineFuncA = getInlineFunc({ inlineFunc });

  return eCreateFunction({ inlineFunc: inlineFuncA, varsKeys });
};

const getNonInlineFunc = function ({ inlineFunc }) {
  // Can escape (...) from being interpreted as inline function by escaping
  // first parenthesis
  if (isEscapedInlineFunc({ inlineFunc })) {
    return inlineFunc.replace('\\', '');
  }

  return inlineFunc;
};

const createFunction = function ({ inlineFunc, varsKeys }) {
  // Create a function with the inline function as body
  const params = `{ ${varsKeys.vars} }, { ${varsKeys.helpers} }`;
  // eslint-disable-next-line no-new-func
  const func = new Function(params, `return ${inlineFunc};`);
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(func, { inlineFunc });

  return func;
};

const eCreateFunction = addErrorHandler(createFunction, {
  message: ({ inlineFunc }) => `Invalid IDL function: '${inlineFunc}'`,
  reason: 'IDL_VALIDATION',
});

module.exports = {
  compileIdlFuncs,
};
