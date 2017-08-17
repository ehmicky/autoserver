'use strict';

const { throwError } = require('../error');

const { bindHelpers } = require('./helpers');

// Process (already compiled) JSL function, i.e. fires it and returns its value
const runJsl = function ({ jsl, jsl: { params }, jslFunc }) {
  // If this is not JSL, returns as is
  if (typeof jslFunc !== 'function') { return jslFunc; }

  bindHelpers({ jsl });

  return jslFunc(params);
};

const addErrorHandler = function (func) {
  return (obj, ...args) => {
    try {
      return func(obj, ...args);
    } catch (error) {
      const { jslFunc } = obj;
      const expression = getJslExpression({ jslFunc });
      const message = `JSL expression failed: '${expression}'`;
      throwError(message, { reason: 'UTILITY_ERROR', innererror: error });
    }
  };
};

const eRunJsl = addErrorHandler(runJsl);

const getJslExpression = function ({ jslFunc, jslFunc: { inlineJsl, name } }) {
  if (inlineJsl) { return inlineJsl; }

  if (!name || name === 'anonymous') { return jslFunc.toString(); }

  return `${name}()`;
};

module.exports = {
  runJsl: eRunJsl,
};
