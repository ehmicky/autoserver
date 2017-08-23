'use strict';

const { addErrorHandler } = require('../error');

const { getVars } = require('./variables');
const { bindHelpers } = require('./helpers');

// Process (already compiled) IDL function, i.e. fires it and returns its value
const runIdlFunc = function ({
  idlFunc,
  input,
  input: { varsRef, helpers },
  vars,
}) {
  // If this is not IDL function, returns as is
  if (typeof idlFunc !== 'function') { return idlFunc; }

  const varsA = getVars(input);
  const varsB = { ...helpers, ...varsA, ...vars };
  bindHelpers({ varsRef, vars: varsB });

  return idlFunc(varsB);
};

const eRunIdlFunc = addErrorHandler(runIdlFunc, {
  message: ({ idlFunc }) =>
    `IDL function failed: '${stringifyIdlFunc({ idlFunc })}'`,
  reason: 'UTILITY_ERROR',
});

const stringifyIdlFunc = function ({ idlFunc, idlFunc: { inlineFunc, name } }) {
  if (inlineFunc) { return inlineFunc; }

  if (!name || name === 'anonymous') { return idlFunc.toString(); }

  return `${name}()`;
};

module.exports = {
  runIdlFunc: eRunIdlFunc,
};
