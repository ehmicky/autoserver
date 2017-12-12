'use strict';

const { addGenErrorHandler } = require('../error');

const { getVars } = require('./vars');
const { stringifyConfigFunc } = require('./tokenize');

// Process config function, i.e. fires it and returns its value
const runConfigFunc = function ({
  configFunc,
  mInput,
  mInput: { serverVars },
  vars,
}) {
  // If this is not config function, returns as is
  if (typeof configFunc !== 'function') { return configFunc; }

  const varsA = getVars(mInput, { vars, serverVars, mutable: false });

  return configFunc(varsA);
};

const eRunConfigFunc = addGenErrorHandler(runConfigFunc, {
  message: ({ configFunc }) =>
    `Function failed: '${stringifyConfigFunc({ configFunc })}'`,
  reason: 'UTILITY_ERROR',
});

module.exports = {
  runConfigFunc: eRunConfigFunc,
};
