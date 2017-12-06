'use strict';

const { addGenErrorHandler } = require('../error');

const { getFuncVars } = require('./vars');
const { stringifySchemaFunc } = require('./tokenize');

// Process (already compiled) schema function,
// i.e. fires it and returns its value
const runSchemaFunc = function ({ schemaFunc, mInput, vars }) {
  // If this is not schema function, returns as is
  if (typeof schemaFunc !== 'function') { return schemaFunc; }

  const varsA = getFuncVars({ mInput, vars });

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
