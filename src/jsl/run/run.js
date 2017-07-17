'use strict';

const { throwJslError } = require('../error');
const { getRawJsl } = require('../tokenize');
const { compileJsl } = require('./compile');

// Process (already compiled) JSL function,
// i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function ({ value, params = {}, type = 'system' }) {
  if (!validTypes.includes(type)) {
    const message = `Invalid JSL type: '${type}'`;
    throwJslError({ message, type: 'system' });
  }

  try {
    const paramsKeys = Object.keys(params);
    const jslFunc = compileJsl({ jsl: value, paramsKeys, type });

    if (typeof jslFunc !== 'function') { return jslFunc; }

    return jslFunc(params);
  } catch (innererror) {
    // JSL without parenthesis
    const rawJsl = getRawJsl({ jsl: value });
    // If non-inline function, function name
    const funcName = typeof value === 'function' &&
      value.name &&
      `${value.name}()`;
    const expression = rawJsl || funcName || value;
    const message = `JSL expression failed: '${expression}'`;
    throwJslError({ message, type, innererror });
  }
};

const validTypes = ['system', 'startup', 'data', 'filter'];

module.exports = {
  runJsl,
};
