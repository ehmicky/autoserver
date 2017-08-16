'use strict';

const { throwError } = require('../../error');
const { getRawJsl } = require('../tokenize');

const { compileJsl } = require('./compile');
const { getParams } = require('./params');

// Process (already compiled) JSL function,
// i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function ({ jsl, value, params = {} }) {
  // Merge JSL parameters with JSL call parameters
  const paramsA = { ...jsl.params, ...params };
  const paramsB = getParams({ params: paramsA });

  try {
    return fireJslFunc({ jsl: value, params: paramsB });
  } catch (error) {
    handleJslError({ error, value });
  }
};

const fireJslFunc = function ({ jsl, params }) {
  const paramsKeys = Object.keys(params);
  const jslFunc = compileJsl({ jsl, paramsKeys });

  if (typeof jslFunc !== 'function') { return jslFunc; }

  return jslFunc(params);
};

const handleJslError = function ({ error, value }) {
  // JSL without parenthesis
  const rawJsl = getRawJsl({ jsl: value });
  // If non-inline function, function name
  const funcName = typeof value === 'function' &&
    value.name &&
    `${value.name}()`;
  const expression = rawJsl || funcName || value;
  const message = `JSL expression failed: '${expression}'`;
  throwError(message, { reason: 'UTILITY_ERROR', innererror: error });
};

module.exports = {
  runJsl,
};
