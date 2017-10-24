'use strict';

const { addGenErrorHandler } = require('../error');

const { getVars } = require('./variables');
const { bindVariables } = require('./helpers');

// Process (already compiled) schema function,
// i.e. fires it and returns its value
const runSchemaFunc = function ({
  schemaFunc,
  mInput,
  mInput: { varsRef, helpers },
  vars,
}) {
  // If this is not schema function, returns as is
  if (typeof schemaFunc !== 'function') { return schemaFunc; }

  const varsA = getVars(mInput);
  const varsB = { ...varsA, ...helpers, ...vars };

  bindVariables({ varsRef, vars: varsB });

  return schemaFunc(varsB);
};

const eRunSchemaFunc = addGenErrorHandler(runSchemaFunc, {
  message: ({ schemaFunc }) =>
    `Schema function failed: '${stringifySchemaFunc({ schemaFunc })}'`,
  reason: 'UTILITY_ERROR',
});

const stringifySchemaFunc = function ({
  schemaFunc,
  schemaFunc: { inlineFunc, name },
}) {
  if (inlineFunc) { return inlineFunc; }

  if (!name || name === 'anonymous') { return schemaFunc.toString(); }

  return `${name}()`;
};

module.exports = {
  runSchemaFunc: eRunSchemaFunc,
};
