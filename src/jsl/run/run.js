'use strict';

const { throwJslError } = require('../error');
const { getRawJsl } = require('../tokenize');

const { compileJsl } = require('./compile');
const { getParams } = require('./params');
const { validateType } = require('./validation');

// Process (already compiled) JSL function,
// i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function ({
  jsl,
  value,
  params = {},
  type = 'system',
  idl,
}) {
  // Merge JSL parameters with JSL call parameters
  const paramsA = { ...jsl.params, ...params };
  const paramsB = getParams({ params: paramsA, type, idl });

  validateType({ type });

  try {
    const paramsKeys = Object.keys(paramsB);
    const jslFunc = compileJsl({ jsl: value, paramsKeys, type });

    if (typeof jslFunc !== 'function') { return jslFunc; }

    return jslFunc(paramsB);
  } catch (error) {
    handleJslError({ error, value, type });
  }
};

const handleJslError = function ({ error, value, type }) {
  // JSL without parenthesis
  const rawJsl = getRawJsl({ jsl: value });
  // If non-inline function, function name
  const funcName = typeof value === 'function' &&
    value.name &&
    `${value.name}()`;
  const expression = rawJsl || funcName || value;
  const message = `JSL expression failed: '${expression}'`;
  throwJslError({ message, type, innererror: error });
};

module.exports = {
  runJsl,
};
