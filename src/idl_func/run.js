'use strict';

const { throwError } = require('../error');

const { bindHelpers } = require('./helpers');

// Process (already compiled) IDL function, i.e. fires it and returns its value
const runIdlFunc = function ({ ifv, ifv: { params }, idlFunc }) {
  // If this is not IDL function, returns as is
  if (typeof idlFunc !== 'function') { return idlFunc; }

  bindHelpers({ ifv });

  return idlFunc(params);
};

const addErrorHandler = function (func) {
  return (obj, ...args) => {
    try {
      return func(obj, ...args);
    } catch (error) {
      const { idlFunc } = obj;
      const expression = stringifyIdlFunc({ idlFunc });
      const message = `IDL function failed: '${expression}'`;
      throwError(message, { reason: 'UTILITY_ERROR', innererror: error });
    }
  };
};

const eRunIdlFunc = addErrorHandler(runIdlFunc);

const stringifyIdlFunc = function ({ idlFunc, idlFunc: { inlineFunc, name } }) {
  if (inlineFunc) { return inlineFunc; }

  if (!name || name === 'anonymous') { return idlFunc.toString(); }

  return `${name}()`;
};

module.exports = {
  runIdlFunc: eRunIdlFunc,
};
