'use strict';

const { addGenErrorHandler } = require('../error');

const { getVars } = require('./vars');
const { stringifySchemaFunc } = require('./tokenize');

// Process schema function, i.e. fires it and returns its value
const runSchemaFunc = function ({
  schemaFunc,
  mInput,
  mInput: { serverVars },
  vars,
}) {
  // If this is not schema function, returns as is
  if (typeof schemaFunc !== 'function') { return schemaFunc; }

  const varsA = getVars(mInput, { vars, serverVars, mutable: false });

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
