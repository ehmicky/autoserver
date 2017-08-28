'use strict';

const { addErrorHandler } = require('../error');

const { getVars } = require('./variables');
const { bindVariables } = require('./helpers');

// Process (already compiled) IDL function, i.e. fires it and returns its value
const runIdlFunc = function ({
  idlFunc,
  mInput,
  mInput: { varsRef, helpers },
  vars,
}) {
  // If this is not IDL function, returns as is
  if (typeof idlFunc !== 'function') { return idlFunc; }

  const varsA = getVars(mInput, vars);
  bindVariables({ varsRef, vars: varsA, helpers });

  // We pass helpers as a second argument instead of merging it with the first
  // argument, because if helpers is big (e.g. it includes a library
  // like Lodash), merging it is relatively slow.
  return idlFunc(varsA, helpers);
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
