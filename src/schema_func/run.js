'use strict';

const { addGenErrorHandler } = require('../error');

const { getVars } = require('./variables');
const { bindVariables } = require('./helpers');
const { stringifySchemaFunc } = require('./tokenize');

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

  const varsA = getVars(mInput, { helpers, vars });

  bindVariables({ varsRef, vars: varsA });

  return schemaFunc(varsA);
};

const eRunSchemaFunc = addGenErrorHandler(runSchemaFunc, {
  message: ({ schemaFunc }) =>
    `Schema function failed: '${stringifySchemaFunc({ schemaFunc })}'`,
  reason: 'UTILITY_ERROR',
});

module.exports = {
  runSchemaFunc: eRunSchemaFunc,
};
