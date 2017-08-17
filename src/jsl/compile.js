'use strict';

const { throwError } = require('../error');
const { setAll } = require('../utilities');

const { getParamsKeys } = require('./params');
const { isJsl, isEscapedJsl } = require('./test');
const { getInlineJsl } = require('./tokenize');

// Compile all JSL in IDL, i.e. apply `new Function()`
const compileIdlJsl = function ({ idl, idl: { jslPaths } }) {
  const paramsKeys = getParamsKeys({ idl });

  return setAll(idl, jslPaths, jsl => compileJsl({ jsl, paramsKeys }));
};

// Transform JSL into a function with the JSL as body
// Returns as it is not JSL
// This can throw if JSL's JavaScript is wrong
const compileJsl = function ({ jsl, paramsKeys }) {
  // If this is not JSL, abort
  if (!isJsl({ jsl })) {
    return getNonJsl({ jsl });
  }

  const inlineJsl = getInlineJsl({ jsl });

  return eCreateFunction({ inlineJsl, paramsKeys });
};

const getNonJsl = function ({ jsl }) {
  // Can escape (...) from being interpreted as JSL by escaping
  // first parenthesis
  if (isEscapedJsl({ jsl })) {
    return jsl.replace('\\', '');
  }

  return jsl;
};

const createFunction = function ({ inlineJsl, paramsKeys }) {
  // Create a function with the JSL as body
  // eslint-disable-next-line no-new-func
  const func = new Function(`{ ${paramsKeys} }`, `return ${inlineJsl};`);
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(func, { inlineJsl });

  return func;
};

const addErrorHandler = function (func) {
  return (obj, ...args) => {
    try {
      return func(obj, ...args);
    } catch (error) {
      const { inlineJsl } = obj;
      const message = `Invalid JSL: '${inlineJsl}'`;
      throwError(message, { reason: 'IDL_VALIDATION', innererror: error });
    }
  };
};

const eCreateFunction = addErrorHandler(createFunction);

module.exports = {
  compileIdlJsl,
};
